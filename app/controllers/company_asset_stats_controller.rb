class CompanyAssetStatsController < ApplicationController
  def index
    @asset_stat = CompanyAssetStat.all
  end

  def new
    @asset_stat = CompanyAssetStat.new
  end

  def edit
    @asset_stat = CompanyAssetStat.find(params[:id])
  end

  def create
    eventParams = allNoneCheck(params[:asset_stat], "assetType")
    not params[:company].nil? ? eventParams[:companyID] = sepByComma(params[:company_text]) : eventParams[:companyID] = []
    eventParams[:aggregateAssets] = nil if eventParams[:assetType].empty? or eventParams[:assetType].include? "Display None"
    eventParams[:aggregateCompanies] = nil if eventParams[:aggregateCompanies].nil? or eventParams[:company].nil?
    
    @asset_stat = CompanyAssetStat.new(eventParams)

    if @asset_stat.save
      redirect_to :action => "edit", :id => @asset_stat.id
    else
      render 'new'
    end
  end

  def update
    eventParams = allNoneCheck(params[:asset_stat], "assetType")
    not params[:company].nil? ? eventParams[:companyID] = sepByComma(params[:company_text]) : eventParams[:companyID] = []
    eventParams[:company] = nil if eventParams[:company].nil?
    eventParams[:aggregateAssets] = nil if eventParams[:aggregateAssets].nil? or eventParams[:assetType].empty? or eventParams[:assetType].include? "Display None"
    eventParams[:aggregateCompanies] = nil if eventParams[:aggregateCompanies].nil? or eventParams[:company].nil?
    eventParams[:statsToShow] = nil if eventParams[:statsToShow].nil?
    
    @asset_stat = CompanyAssetStat.find(params[:id])
    @asset_stat.update_attributes(eventParams)

    if (not @asset_stat.errors.any?) and @asset_stat.save
      redirect_to :action => "edit", :id => @asset_stat.id
    else
      render 'edit'
    end
  end

  def destoy
    @asset_stat = CompanyAssetStat.find(params[:id])
    @asset_stat.destroy

    respond_to do |format|
      format.html { redirect_to company_asset_stats_url }
      format.json { head :no_content }
    end
  end

end