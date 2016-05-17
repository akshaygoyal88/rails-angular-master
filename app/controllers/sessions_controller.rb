# class SessionsController < ApplicationController
#   def create
#   	@current_user = Author.find_by_provider_and_uid(env["omniauth.auth"]["provider"], env["omniauth.auth"]["uid"]) || Author.create_with_omniauth(env["omniauth.auth"])
#     session[:user_id] = @current_user.id
#     sign_in(:user, @current_user, store: true, bypass: true)
#     # sign_in @current_user
#     # cookies[:auth_headers] = @current_user.uid
#     redirect_to root_url
#   end

#   def destroy
#     session[:user_id] = nil
#     cookies[:auth_headers] = nil
#     redirect_to root_url
#   end
# end