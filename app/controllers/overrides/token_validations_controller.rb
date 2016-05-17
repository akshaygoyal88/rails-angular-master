# app/controllers/overrides/token_validations_controller.rb
module Overrides
  class TokenValidationsController < DeviseTokenAuth::TokenValidationsController

    def validate_token
      # @resource will have been set by set_user_by_token concern
      if false #session[:user_id].present?
        @resource = Author.find session[:user_id]
        render json: {
          data: @resource.as_json(methods: :calculate_operating_thetan)
        }
      elsif @resource || $resource
        render json: {
          data: $resource.as_json(methods: :calculate_operating_thetan)
        }
      else
        render json: {
          success: false,
          errors: ["Invalid login credentials"]
        }, status: 401
      end
    end
  end
end