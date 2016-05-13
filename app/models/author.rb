class Author < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :confirmable,:timeoutable
  include DeviseTokenAuth::Concerns::User

	before_save -> do
    self.uid = SecureRandom.uuid
    skip_confirmation!
  end
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
    end
  end
end
