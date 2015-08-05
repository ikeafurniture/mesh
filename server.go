package main

import (
	// "errors"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	// "os"
	// "time"

	"github.com/gin-gonic/gin"
	"github.com/inhies/go-cjdns/admin"
	"github.com/inhies/go-cjdns/key"
	"github.com/kylelemons/godebug/pretty"
)

type Post struct {
	Author    string
	ID        string
	Type      string // text, photo, video, audio, chat -- mixed?
	Timestamp int64
	Format    string // html or markdown
	Tags      []string
	SourceURL string
	Size      int64

	// text posts
	Title string
	Body  string

	// photo posts
	Photos  []Photo
	Caption string
	Width   int64
	Height  int64
}

type Photo struct {
	Caption string
	Width   int64
	Height  int64
}

type peerInfo struct {
	PublicKey *key.Public
	IPV6      net.IP
	State     string
}

const dataFile = "./files.json"

// var fileMutex = new(sync.Mutex)

// Public Endpoints

func posts(c *gin.Context) {

	// Get distance of peer

	// Return all files visible from this distance

	// dir, err := ioutil.ReadDir(".")
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	//
	// files := []PostInfo{}
	//
	// for _, file := range dir {
	// 	f := FileInfo{
	// 		Name:    file.Name(),
	// 		Size:    file.Size(),
	// 		Mode:    file.Mode(),
	// 		ModTime: file.ModTime(),
	// 		IsDir:   file.IsDir(),
	// 	}
	// 	files = append(files, f)
	// }

	var data []Post
	file, err := ioutil.ReadFile(dataFile)
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(file, &data)
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Println(data)

	c.JSON(http.StatusOK, data)
}

func post(c *gin.Context) {
	id := c.Param("id")

	// Get distance of peer

	// c.Data(http.StatusOK, contentType, data)
	// http.ServeFile(w, r, r.URL.Path[6:])
	c.File(id)
}

// Local endpoints

func addPost(c *gin.Context) {

	// Restrict to requests coming from own ip

}

func removePost(c *gin.Context) {

	// Restrict to requests coming from own ip

}

func editPost(c *gin.Context) {

}

func peers(c *gin.Context) {
	conn, err := admin.Connect(nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	results, err := conn.InterfaceController_peerStats()

	pretty.Print(results)
	peers := []peerInfo{}

	for _, peer := range results {
		p := peerInfo{
			PublicKey: peer.PublicKey,
			IPV6:      peer.PublicKey.IP(),
			State:     peer.State,
		}
		peers = append(peers, p)
	}

	c.JSON(http.StatusOK, peers)
}

func peer(c *gin.Context) {
	pretty.Print(c.Param("id"))

	// http.Get(url)
	c.File("id")
}

func editPeer(c *gin.Context) {

}

func lookupPeer(ip string) {

}

func main() {
	r := gin.Default()

	// Gin Routes
	r.GET("/posts", posts)
	r.GET("/post/:id", post)

	r.GET("/peers", peers)
	r.GET("/peer/:id", peer)

	r.Static("/static", "./static")

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
