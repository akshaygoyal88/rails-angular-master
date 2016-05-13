Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github,        "7b79871b953c3a6bd8ea",   "542d2b7924db198daef091a1d6bb951c594921f2",   scope: 'email,profile'
  # provider :facebook,      ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET']
  # provider :google_oauth2, ENV['GOOGLE_KEY'],   ENV['GOOGLE_SECRET']
  # provider :developer,
  #   :fields => [:name, :hacker_name],
  #   :uid_field => :hacker_name
end
