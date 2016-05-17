class Author < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :confirmable,:timeoutable,:omniauthable
  include DeviseTokenAuth::Concerns::User

	before_save -> do
    self.uid = SecureRandom.uuid
    skip_confirmation!
  end
  def self.create_with_omniauth(auth)
    create! do |user|
      user.email = auth.extra.raw_info.email
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
      user.password = SecureRandom.urlsafe_base64
    end
  end
end
