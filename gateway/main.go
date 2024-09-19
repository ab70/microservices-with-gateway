package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func main() {
	app := fiber.New(fiber.Config{
		// Prefork: true,
	})
	// Proxy requests for /api/messages to the Messages service (http://localhost:8082)
	app.All("/api/messages/*", func(c *fiber.Ctx) error {
		return proxy.Do(c, "http://localhost:5001"+c.OriginalURL())
	})
	// Proxy requests for /api/auth to the Auth service (http://localhost:8081)
	app.All("/api/auth/*", func(c *fiber.Ctx) error {
		return proxy.Do(c, "http://localhost:5002"+c.OriginalURL())
	})

	
	app.Get("/gates", func(c *fiber.Ctx) error {
		// return c.SendString("Hello, World!")
		return c.JSON(fiber.Map{"message": "Hello, World!"})
	})
	// Start the API Gateway on port 8080
	log.Fatal(app.Listen(":5000"))
}
