require 'rubygems'

class S7apiLogUiController < ApplicationController

  # GET /db_calls
  # GET /db_calls.json
  def index
    # @db_calls = DbCall.all

    # respond_to do |format|
    #   format.html # index.html.erb
    #   format.json { render json: @db_calls }
    # end
  end

  # GET /db_calls/1
  # GET /db_calls/1.json
  def show
    # @db_call = DbCall.find(params[:id])

    # respond_to do |format|
    #   format.html # show.html.erb
    #   format.json { render json: @db_call }
    # end
  end

  # GET /db_calls/new
  # GET /db_calls/new.json
  def new
    # p 'new'
    # @db_call = DbCall.new

    # respond_to do |format|
    #   format.html # new.html.erb
    #   format.json { render json: @db_call }
    # end
  end

  # GET /db_calls/1/edit
  def edit
    # @db_call = DbCall.find(params[:id])
  end

  # POST /db_calls
  # POST /db_calls.json
  def create
    # @db_call = DbCall.new(params[:db_call])

    # result = generateResults(@db_call)
    # @db_call.update_attributes(:results => result.to_s)

    # respond_to do |format|
    #   if @db_call.save
    #     format.html { redirect_to @db_call, notice: 'Db call was successfully created.' }
    #     format.json { render json: @db_call, status: :created, location: @db_call }
    #   else
    #     format.html { render action: "new" }
    #     format.json { render json: @db_call.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PUT /db_calls/1
  # PUT /db_calls/1.json
  def update
    # @db_call = DbCall.find(params[:id])

    # respond_to do |format|
    #   if @db_call.update_attributes(params[:db_call])
    #     format.html { redirect_to @db_call, notice: 'Db call was successfully updated.' }
    #     format.json { head :no_content }
    #   else
    #     format.html { render action: "edit" }
    #     format.json { render json: @db_call.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /db_calls/1
  # DELETE /db_calls/1.json
  def destroy
  #   @db_call = DbCall.find(params[:id])
  #   @db_call.destroy

  #   respond_to do |format|
  #     format.html { redirect_to db_calls_url }
  #     format.json { head :no_content }
  #   end
  # end
  end
end
