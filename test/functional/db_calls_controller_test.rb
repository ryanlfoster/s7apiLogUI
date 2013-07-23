require 'test_helper'

class DbCallsControllerTest < ActionController::TestCase
  setup do
    @db_call = db_calls(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:db_calls)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create db_call" do
    assert_difference('DbCall.count') do
      post :create, db_call: { definedVars: @db_call.definedVars, results: @db_call.results, varsToShow: @db_call.varsToShow }
    end

    assert_redirected_to db_call_path(assigns(:db_call))
  end

  test "should show db_call" do
    get :show, id: @db_call
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @db_call
    assert_response :success
  end

  test "should update db_call" do
    put :update, id: @db_call, db_call: { definedVars: @db_call.definedVars, results: @db_call.results, varsToShow: @db_call.varsToShow }
    assert_redirected_to db_call_path(assigns(:db_call))
  end

  test "should destroy db_call" do
    assert_difference('DbCall.count', -1) do
      delete :destroy, id: @db_call
    end

    assert_redirected_to db_calls_path
  end
end
