# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

include BCrypt

user1 = User.create(username: 'user1', password_digest: Password.create('password'));
user2 = User.create(username: 'user2', password_digest: Password.create('password'));
user3 = User.create(username: 'user3', password_digest: Password.create('password'));
user4 = User.create(username: 'user4', password_digest: Password.create('password'));
user5 = User.create(username: 'user5', password_digest: Password.create('password'));
user6 = User.create(username: 'user6', password_digest: Password.create('password'));
user7 = User.create(username: 'user7', password_digest: Password.create('password'));
user8 = User.create(username: 'user8', password_digest: Password.create('password'));
user9 = User.create(username: 'user9', password_digest: Password.create('password'));
user10 = User.create(username: 'user10', password_digest: Password.create('password'));
