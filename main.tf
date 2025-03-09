provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "BK-Fighter-3D-Server"
  }
}

resource "aws_db_instance" "mongodb" {
  engine         = "mongodb"
  engine_version = "4.4"
  instance_class = "db.t3.micro"
  name           = "bkfighter"
  username       = "admin"
  password       = "password" # Change this to a secure password

  tags = {
    Name = "BK-Fighter-3D-MongoDB"
  }
}

output "app_server_public_ip" {
  value = aws_instance.app_server.public_ip
}

output "mongodb_endpoint" {
  value = aws_db_instance.mongodb.endpoint
}