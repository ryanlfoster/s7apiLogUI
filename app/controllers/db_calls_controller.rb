require 'rubygems'

class DbCallsController < ApplicationController

  # GET /db_calls
  # GET /db_calls.json
  def index
    @db_calls = DbCall.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @db_calls }
    end
  end

  # GET /db_calls/1
  # GET /db_calls/1.json
  def show
    @db_call = DbCall.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @db_call }
    end
  end

  # GET /db_calls/new
  # GET /db_calls/new.json
  def new
    p 'new'
    @db_call = DbCall.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @db_call }
    end
  end

  # GET /db_calls/1/edit
  def edit
    @db_call = DbCall.find(params[:id])
  end

  # POST /db_calls
  # POST /db_calls.json
  def create
    # p params[:us_dc_text]
    @db_call = DbCall.new(params[:db_call])

    toDefine = {}
    toDefine["dataCenter"], statsQueried, indVars, selectedDisplays, toGroup = [], [], [], [], []

    # defines what datacenters to query by
    toDefine["dataCenter"].push("na") if params[:na_dc]
    toDefine["dataCenter"].push("emea") if params[:emea_dc]
    toDefine["dataCenter"].push("apac") if params[:apac_dc]
    toDefine.delete("dataCenter") if toDefine["dataCenter"].empty?

    # defines what statistics to query by
    statsQueried.push("numExecs")
    statsQueried.push("minExecTime") if params[:min_eTime]
    statsQueried.push("maxExecTime") if params[:max_eTime]
    statsQueried.push("medExecTime") if params[:med_eTime]
    statsQueried.push("meanExecTime") if params[:mean_eTime]
    # toDefine.delete("stats") if  statsQueried.empty?

    # defines what toDefine to query by
    toDefine["user"] = sepByComma(params[:user_text]) if params[:user]
    toDefine["applicationUsed"] = sepByComma(params[:application_text]) if params[:application]
    toDefine["companyName"] = sepByComma(params[:company_text]) if params[:company]
    toDefine["apiEvent"] = sepByComma(params[:log_event_text]) if params[:log_event]

    toDefine.each do |key, valArr|
      if valArr.length != 1
        indVars.push(key) #change name
      end
      toGroup.push(key) 
    end

    selectedDisplays.push("barChart") if params[:draw_bar]
    selectedDisplays.push("pieChart") if params[:draw_pie]
    selectedDisplays.push("table") if params[:draw_table]



    if indVars.empty?
      @db_call.errors.add(:indVars, 'must specify some variables to vary by')
    else
      @db_call.update_attributes( :pipelineTask => genPipeline(@db_call, toDefine, toGroup, statsQueried),
                                  :indVars => indVars.to_s.html_safe,
                                  :statsQueried => statsQueried.to_s.html_safe,
                                  :selectedDisplays => selectedDisplays.to_s.html_safe,
                                  :dateGroup => params[:dateGroup].html_safe )
    end

    if (not @db_call.errors.any?) and @db_call.save
      redirect_to :action => "edit", :id => @db_call.id
    else
      p @db_call.errors
      render 'new'
    end
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
    @db_call = DbCall.find(params[:id])
    @db_call.update_attributes(params[:db_call])

    toDefine = {}
    toDefine["dataCenter"], statsQueried, indVars, selectedDisplays, toGroup = [], [], [], [], []

    # defines what datacenters to query by
    toDefine["dataCenter"].push("na") if params[:na_dc]
    toDefine["dataCenter"].push("emea") if params[:emea_dc]
    toDefine["dataCenter"].push("apac") if params[:apac_dc]
    toDefine.delete("dataCenter") if toDefine["dataCenter"].empty?

    # defines what statistics to query by
    statsQueried.push("numExecs")
    statsQueried.push("minExecTime") if params[:min_eTime]
    statsQueried.push("maxExecTime") if params[:max_eTime]
    statsQueried.push("medExecTime") if params[:med_eTime]
    statsQueried.push("meanExecTime") if params[:mean_eTime]
    # toDefine.delete("stats") if  statsQueried.empty?

    # defines what toDefine to query by
    toDefine["user"] = sepByComma(params[:user_text]) if params[:user]
    toDefine["applicationUsed"] = sepByComma(params[:application_text]) if params[:application]
    toDefine["companyName"] = sepByComma(params[:company_text]) if params[:company]
    toDefine["apiEvent"] = sepByComma(params[:log_event_text]) if params[:log_event]

    toDefine.each do |key, valArr|
      if valArr.length != 1
        indVars.push(key) #change name
      end
      toGroup.push(key) 
    end

    selectedDisplays.push("barChart") if params[:draw_bar]
    selectedDisplays.push("pieChart") if params[:draw_pie]
    selectedDisplays.push("table") if params[:draw_table]
    
    @db_call.update_attributes( :pipelineTask => genPipeline(@db_call, toDefine, toGroup, statsQueried),
                                :indVars => indVars.to_s.html_safe,
                                :statsQueried => statsQueried.to_s.html_safe,
                                :selectedDisplays => selectedDisplays.to_s.html_safe,
                                :dateGroup => params[:dateGroup].html_safe )

    if @db_call.save
      redirect_to :action => "edit", :id=>@db_call.id
    else
      render 'new'
    end
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
    @db_call = DbCall.find(params[:id])
    @db_call.destroy

    respond_to do |format|
      format.html { redirect_to db_calls_url }
      format.json { head :no_content }
    end
  end
end
