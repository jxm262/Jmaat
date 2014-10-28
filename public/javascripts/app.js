/** @jsx React.DOM */
var PostingBox = React.createClass({
	loadPostingsFromServer: function(){
		$.ajax({
			url: "/posting/all",  //this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data[0]});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handlePostingSubmit: function(posting) {
		//shortcut to quickly update ui without waiting for ajax (its duplicated in callback anyway)
		var newPostings = this.state.data.concat(posting);
		this.setState({data: newPostings});
	    $.ajax({
	        url: "../posting/save",
	        dataType: 'json',
	        contentType: 'application/json; charset=utf-8',
	        type: 'POST',
	        data: JSON.stringify(posting),
	        success: function(data) {
				this.setState({data: newPostings});
	        }.bind(this),
	        error: function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this)
	      });
	},	
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadPostingsFromServer();
	},		  
	render: function() {
		return (
				<div className="postingBox">
	    	    	<h1>Postings</h1>
	    	    	<PostingList data={this.state.data} />
	    	        <PostingForm onPostingSubmit={this.handlePostingSubmit}/>
	    	    </div>
		);
	}
});

var PostingList = React.createClass({
	render: function() {
		var postingNodes = this.props.data.map(function (posting) {
			return (
		        <Posting title={posting.title}>
		          {posting.text}
		        </Posting>
		      );
		});
		return (
				<div className="postingList">
		        	{postingNodes}
		        </div>
		);
	}
});

var Posting = React.createClass({
	render: function() {
		return (
				<div className="posting">
					<h2 className="postingTitle">
						{this.props.title}
					</h2>
					{this.props.children}
				</div>
		);
	}
});
      
var PostingForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var postingId = this.refs.postingId.getDOMNode().value.trim();
		var text = this.refs.text.getDOMNode().value.trim();
		if (!text || !postingId) {
			return;
		}
		this.props.onPostingSubmit({"postingId": postingId, "title": postingId, "text": text});		//read up on when to use props vs state
		this.refs.postingId.getDOMNode().value = '';
		this.refs.text.getDOMNode().value = '';
		return;
	},	
	render: function() {
		return (
				<form class="form-horizontal" role="form" onSubmit={this.handleSubmit}>
					<div class="form-group">
						<label for="posting_id" class="col-sm-2 control-label">Posting Id</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="posting_id2" ref="postingId"/>
						</div>
					</div>
					<div class="form-group">
						<label for="title" class="col-sm-2 control-label">Title</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="title2" ref="title"/>
						</div>
					</div>
					<div class="form-group">
						<label for="text" class="col-sm-2 control-label">Text</label>
						<div class="col-sm-10">
							<textarea class="form-control" rows="3" id="text2" ref="text"></textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-primary" id="submit2" value="Post">Submit</button>
							<button type="submit" class="btn btn-danger" id="delete2">Delete</button>
						</div>
					</div>					
				</form>
		);
	}
});

React.renderComponent(
    <PostingBox url="comments.json" />, 
	document.getElementById('test')
);


