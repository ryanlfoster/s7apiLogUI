class CompanyAssetStatsController < ApplicationController
  def index
    @company_asset_stats = CompanyAssetStats.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @asset_stats }
    end
  end

  def show
  end

  def new
    @company_asset_stats = CompanyAssetStats.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @asset_stat }
    end
  end

  def edit
  end

  def create
    @company_asset_stats = CompanyAssetStats.new(params[:company_asset_stats])

    if @company_asset_stats.save
      redirect_to :action => "index"
      # redirect_to :action => "edit", :id => @db_call.id
    else
      # p @db_call.errors
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

  def update
  end

  def destoy
  end
end
