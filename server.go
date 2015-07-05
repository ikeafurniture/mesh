package main

import (
	"fmt"
	"github.com/inhies/go-cjdns/admin"
	"github.com/kylelemons/godebug/pretty"
	"io/ioutil"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	listing, err := ioutil.ReadDir(".")
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, f := range listing {
		fmt.Fprintf(w, "<a href=/file/%s>%s</a></br>", f.Name(), f.Name())
	}
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[6:])
	pretty.Print(r.URL.Path[6:])
}

func peerStats() {

	conn, err := admin.Connect(nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	results, err := conn.InterfaceController_peerStats()
	if err != nil {
		fmt.Println(err)
		return
	}
	pretty.Print(results)

}

func main() {
	// peerStats()
	http.HandleFunc("/", handler)
	http.HandleFunc("/file/", fileHandler)
	http.ListenAndServe(":8080", nil)
}
