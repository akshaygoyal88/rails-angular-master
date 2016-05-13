class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  after_filter  :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def authenticate_current_user
    if get_current_user.nil?
      # head :unauthorized 
      redirect_to sign_in_path
    end
  end

  def get_current_user
    return nil unless cookies[:auth_headers]
    auth_headers = JSON.parse(cookies[:auth_headers])

    expiration_datetime = DateTime.strptime(auth_headers["expiry"], "%s")
    current_user = Author.find_by(uid: auth_headers["uid"])


    user = User.create_with_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    
    if current_user &&
       current_user.tokens.has_key?(auth_headers["client"]) &&
       expiration_datetime > DateTime.now

      @current_user = current_user
    end
    @current_user
  end

  protected

  def verified_request?
    super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
  end  
end
