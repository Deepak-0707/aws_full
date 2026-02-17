pipeline {
    agent any

    environment {
        IMAGE = "deepakm06/app:${BUILD_NUMBER}"
        EC2_HOST = "43.205.138.33"
        EC2_USER = "ubuntu"
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
                sshagent(['ec2instance']) {

                    bat """
                        ssh -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% ^
                        "docker pull %IMAGE% && ^
                         docker stop node-app 2>nul || echo Container not running && ^
                         docker rm node-app 2>nul || echo Container not present && ^
                         docker run -d --name node-app -p 80:3000 %IMAGE%"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}
