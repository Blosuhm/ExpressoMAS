from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import json
import mimetypes

accounts_path = "data.json"
class Server(BaseHTTPRequestHandler):
    def do_GET(self):
        # Get the parent directory of the script
        parent_dir = os.path.dirname(os.path.dirname(__file__))

        # Set the default file path to "index.html"
        file_path = os.path.join(parent_dir, "index.html")

        # If the request path is not empty, use it as the file path
        if self.path != "/":
            file_path = os.path.join(parent_dir, self.path.lstrip("/"))

        # Check if the file exists
        if not os.path.exists(file_path):
            self.send_error(404)
            return

        # Set the content type and send the file
        self.send_response(200)
        content_type, _ = mimetypes.guess_type(file_path)
        self.send_header("Content-type", content_type)
        self.end_headers()
        with open(file_path, "rb") as f:
            self.wfile.write(f.read())

    def do_POST(self):
        # Parse the POST data

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        post_data = post_data.decode("utf-8")
        print(post_data)
        

        # Parse the POST data as a form
        if self.path.endswith("/add-to-cart"):
            data = json.loads(post_data)
            print("hi",data)
            with open(accounts_path, "r") as f:
                accounts = json.load(f)
                accounts["accounts"][accounts["loggedIn"]]["cart"] = data.get("cart")
            with open(accounts_path, "w") as f:
                json.dump(accounts, f, indent=4)
        if self.path.endswith("/logout"):
            with open(accounts_path, "r") as f:
                accounts = json.load(f)
                accounts["loggedIn"] = None
            with open(accounts_path, "w") as f:
                json.dump(accounts, f, indent=4)

        if self.path == "/login/login":
            data = json.loads(post_data)
            with open(accounts_path, "r") as f:
                accounts = json.load(f)
                accounts["loggedIn"] = data
            with open(accounts_path, "w") as f:
                json.dump(accounts, f, indent=4)

        if self.path == "/signup/signup":
            print("Signing up...")
            # Convert the POST data to a dictionary
            data = json.loads(post_data)

            # Extract the values of the "username", "email", and "password" fields
            username = data["username"]
            email = data["email"]
            password = data["password"]

            # Append the new account to the "accounts" list in the JSON file
            with open(accounts_path, "r") as f:
                accounts = json.load(f)
            accounts["accounts"].append({
                "username": username,
                "email": email,
                "password": password,
                "cart": []
            })
            with open(accounts_path, "w") as f:
                json.dump(accounts, f, indent=4)

        # Send a response to the client
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write("Data received and processed!".encode("utf-8"))


def run(server_class=HTTPServer, handler_class=Server, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print("Starting server on port {}...".format(port))
    httpd.serve_forever()


run()
