pipeline {
    agent any

    environment {
        IMAGE = "deepakm06/app:${BUILD_NUMBER}"
        EC2_HOST = "ubuntu@43.205.138.33"
    }

    stages {

        stage('Build Image') {
            steps {
                bat 'docker build -t %IMAGE% .'
            }
        }

        stage('Login Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerHubAccessToken',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                bat 'docker push %IMAGE%'
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
            credentialsId: 'ec2instance',
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
        )]) {
                    bat """
ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ubuntu@43.205.138.33 "docker pull deepakm06/app:2 && docker run -d --name app_container deepakm06/app:2"
"""

                }
            }
        }
    }
}
