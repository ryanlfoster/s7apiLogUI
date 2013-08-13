class CompanyEventsController < ApplicationController
  def index
    @company_event = CompanyEvent.all
  end

  def new
    @company_event = CompanyEvent.new
  end

  def edit
    @company_event = CompanyEvent.find(params[:id])
  end

  def create
    eventParams = allNoneCheck(params[:company_event], "fileType", "logType")
    not params[:company].nil? ? eventParams[:companyID] = sepByComma(params[:company_text]) : eventParams[:companyID] = []
    @company_event = CompanyEvent.new(eventParams)

    if @company_event.save
      redirect_to :action => "edit", :id => @company_event.id
    else
      render 'new'
    end
  end

  def update
    params[:company_event][:company] = nil if params[:company_event][:company].nil?
    params[:company_event][:aggregateCompanies] = nil if params[:company_event][:aggregateCompanies].nil?
    params[:company_event][:aggregateLogs] = nil if params[:company_event][:aggregateLogs].nil?
    params[:company_event][:aggregateFiles] = nil if params[:company_event][:aggregateFiles].nil?
    eventParams = allNoneCheck(params[:company_event], "fileType", "logType")
    not params[:company].nil? ? eventParams[:companyID] = sepByComma(params[:company_text]) : eventParams[:companyID] = []
    @company_event = CompanyEvent.find(params[:id])
    @company_event.update_attributes(eventParams)

    if (not @company_event.errors.any?) and @company_event.save
      redirect_to :action => "edit", :id => @company_event.id
    else
      render 'edit'
    end
  end

  def destoy
    @company_event = CompanyEvent.find(params[:id])
    @company_event.destroy

    respond_to do |format|
      format.html { redirect_to company_event_url }
      format.json { head :no_content }
    end
  end

end