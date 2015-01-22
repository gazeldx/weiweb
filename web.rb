# require 'json'
require 'sinatra'
require 'sinatra/reloader' if development? #NOTICE: For debug, you need uncomment this line and "gem 'sinatra-reloader'" in Gemfile.

set :bind, '0.0.0.0'
set :port, 9494

enable :sessions

get '/' do
  erb :index
end
#
# get '/tables/:table_name' do
#   @schema = DB.schema(params[:table_name].to_sym)
#
#   @dataset = DB[params[:table_name].to_sym].extension(:pagination)\
#                .paginate((params[:page] || 1).to_i, 50, record_count=nil)
#
#   erb :table
# end

helpers do

end