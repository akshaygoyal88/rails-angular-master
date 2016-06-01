Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github,        "your keys",   "your secret",   scope: 'email,profile'
   provider :facebook, 'your keys', 'your secret'
  # provider :google_oauth2, ENV['GOOGLE_KEY'],   ENV['GOOGLE_SECRET']
  # provider :developer,
  #   :fields => [:name, :hacker_name],
  #   :uid_field => :hacker_name
end
