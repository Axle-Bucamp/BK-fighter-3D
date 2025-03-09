provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "BK-Fighter-3D-Server"
  }

  user_data = <<-EOF
              #!/bin/bash
              echo "export SERVER_URL=${var.server_url}" >> /etc/environment
              echo "export SERVER_PORT=${var.server_port}" >> /etc/environment
              echo "export MONGODB_URL=${var.mongodb_url}" >> /etc/environment
              EOF
}

variable "server_url" {
  default = "http://localhost:4000"
}

variable "server_port" {
  default = 4000
}

variable "mongodb_url" {
  default = "mongodb://localhost:27017/bkfighter"
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}