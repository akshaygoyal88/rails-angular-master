class PostsController < ApplicationController
  respond_to :html, :json
  def index
    @post = Post.all
    respond_with(@posts) do |format|
      format.json { render :json => @post.as_json }
      format.html
    end
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      render json: @post.as_json, status: :ok
    else
      render json: {post: @post.errors, status: :no_content}
    end
  end

  def update
  end

  def show
  end

  def edit
  end

  def destroy
    @post= Post.find params[:id]
    @post.destroy
    render json: {status: :ok}
  end

  def post_params
    params.require(:post).permit!
  end
end
