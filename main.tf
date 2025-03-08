provider "aws" {
  region = "us-west-2"
}

resource "aws_ecr_repository" "bk_fighter_3d" {
  name = "bk-fighter-3d"
}

resource "aws_ecs_cluster" "bk_fighter_3d" {
  name = "bk-fighter-3d-cluster"
}

resource "aws_ecs_task_definition" "bk_fighter_3d" {
  family                   = "bk-fighter-3d"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name  = "bk-fighter-3d"
    image = "${aws_ecr_repository.bk_fighter_3d.repository_url}:latest"
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
}

resource "aws_ecs_service" "bk_fighter_3d" {
  name            = "bk-fighter-3d-service"
  cluster         = aws_ecs_cluster.bk_fighter_3d.id
  task_definition = aws_ecs_task_definition.bk_fighter_3d.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = [aws_subnet.main.id]
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "ecs_tasks" {
  name        = "bk-fighter-3d-sg"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
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