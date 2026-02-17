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
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2instance', keyFileVariable: 'SSH_KEY_FILE')]) {
            bat """
            icacls "%SSH_KEY_FILE%" /inheritance:r
            icacls "%SSH_KEY_FILE%" /grant:r "%USERNAME%:R"
            ssh -i "%SSH_KEY_FILE%" -o StrictHostKeyChecking=no ubuntu@43.205.138.33 "docker pull deepakm06/app:3 && docker stop app_container || exit 0 && docker rm app_container || exit 0 && docker run -d --name app_container -p 80:3000 deepakm06/app:3"
            """
        }
    }
}

        
            }
        }
