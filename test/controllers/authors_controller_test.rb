require 'test_helper'

class AuthorsControllerTest < ActionController::TestCase
  test "should get sign_in" do
    get :sign_in
    assert_response :success
  end

end
