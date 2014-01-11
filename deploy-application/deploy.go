package main

// libraries
import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
	"io/ioutil"
	"os"
	"strconv"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// Controller
func Service(rw http.ResponseWriter, req *http.Request) {

	var version string = "0.0.1"

	if req.Method == "POST" {

		// boolean variables to check valid params vía post
		var go_application bool = false
		var go_command bool = false
		// read form value (post data)
		password := req.FormValue("password")
		application := req.FormValue("application")
		command := req.FormValue("command")

		if Auth(password) {
			// specify applicactions names (daemons)
			switch application {
			case "my-application":
				go_application = true
			case "my-application-beta":
				go_application = true
			default:
				go_application = false
			}

			// specify commands names (daemon command)
			switch command {
			case "start":
				go_command = true
			case "restart":
				go_command = true
			case "status":
				go_command = true
			case "deploy":
				go_command = true
			default:
				go_command = false
			}

			// Invalid application name
			if !go_application {
				io.WriteString(rw, "La aplicación ["+application+"] no existe.\n")
			}

			// Invalid command name
			if !go_command {
				io.WriteString(rw, "El comando ["+command+"] no existe.\n")
			}

			// Execute command service application command
			if go_application && go_command {
				deployCmd := exec.Command("service", application, command)

				deployOut, err := deployCmd.Output()
				if err != nil {
					panic(err)
				}

				io.WriteString(rw, string(deployOut)+"\n")
			}

		} else {
			io.WriteString(rw, "Contraseña incorrecta.\n")
		}
	} else {
		io.WriteString(rw, "Deploy applications "+version+"\nThis application is written in GoLang\nAuthor: Paulo McNally\n")
	}

}

/*
Validate password via post vs static password
@param password
@return bool

deployMyApplication = b5454f201dd9fc28c967c6140cd0c4c8
*/
func Auth(password string) bool {
	if Hash(password) == "b5454f201dd9fc28c967c6140cd0c4c8" {
		return true
	} else {
		return false
	}
}


/*
Convert password to hash md5 using salt
@param password
@return string
*/
func Hash(password string) string {
	hash := md5.New()
	io.WriteString(hash, password)
	return fmt.Sprintf("%x", hash.Sum(nil))
}

func main() {
	// pid write
	path, _ := os.Getwd()
	pid := []byte(strconv.Itoa(os.Getpid()))
	piderr := ioutil.WriteFile( path + "deploy.pid", pid, 0644)
	check(piderr)

	// route
	http.HandleFunc("/", Service)
	err := http.ListenAndServe(":9000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
