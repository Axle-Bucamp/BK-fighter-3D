terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

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
  engine               = "mongodb"
  engine_version       = "5.0"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  identifier           = "bk-fighter-3d-db"
  username             = "admin"
  password             = var.db_password
  skip_final_snapshot  = true
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP inbound traffic"

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "db_password" {
  description = "Password for the database"
  type        = string
}

output "app_server_public_ip" {
  value = aws_instance.app_server.public_ip
}

output "mongodb_endpoint" {
  value = aws_db_instance.mongodb.endpoint
}