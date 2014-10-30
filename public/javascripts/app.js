/** @jsx React.DOM */
var AdminBox = React.createClass({
	loadPostingsFromServer: function(){
		$.ajax({
			url: "/api/posting/all",  //this.props.url,
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
	        url: "../api/posting/save",
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
	handlePostingDelete: function(posting){
		$("#postingId").val("");
		$("#title").val("");
		$("#text").val("");

		var newPostings = this.state.data.filter(function(e){
			return e.postingId !== posting.postingId;
		});
		
		this.setState({data: newPostings});	
		
		$.ajax({
	    	url: "../api/posting/delete",
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
	handleLinkClick: function(e, postingId){
		e.preventDefault();

		$.get("../api/posting/" + postingId, function(el){
			var posting = el[0][0];
			$("#postingId").val(posting.postingId);
			$("#title").val(posting.title);
			$("#text").val(posting.text);
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
			<div className="adminBox">
				<PostingForm onPostingSubmit={this.handlePostingSubmit} onPostingDelete={this.handlePostingDelete}/>
				<div className="col-xs-4 col-md-offset-1 col-md-4">
					<h1></h1>
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h3 className="panel-title">Code Snippets and Such</h3>
						</div>
						<div className="panel-body">
							<PostingList data={this.state.data} linkClickHandler={this.handleLinkClick}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});


var PostingBox = React.createClass({
	loadPostingsFromServer: function(){
		$.ajax({
			url: this.state.url,
			dataType: 'json',
			success: function(data) {
				this.setState({posting: data[0][0]});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	loadLinksFromServer: function(){
		$.ajax({
			url: "/api/posting/all",  //this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data[0]});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleLinkClick: function(){
		return;
	},
	getInitialState: function() {
		return {data: [], posting: [], url: "/api/posting/" + document.URL.split("/")[4]};
	},
	componentDidMount: function() {
		this.loadPostingsFromServer();
		this.loadLinksFromServer();
	},		  
	render: function() {
		return (
			<div className="postingBox">
				<PostingElem data={this.state.posting}/>
				<div className="col-xs-4 col-md-offset-1 col-md-4">
					<h1></h1>
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h3 className="panel-title">Code Snippets and Such</h3>
						</div>
						<div className="panel-body">
							<PostingList data={this.state.data} linkClickHandler={this.handleLinkClick}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var PostingList = React.createClass({
	render: function() {
		var that = this;	//I have a love-hate relationship with js.  This is one reason why i hate :)
		var postingNodes = this.props.data.map(function (posting) {
			return (
				<ul>
	        		<PostingLink title={posting.title} link={posting.postingId} linkClickHandler={that.props.linkClickHandler}>
	        			{posting.text}
	        		</PostingLink>
	        	</ul>
			);
		});		
		return (
			<div className="postingList">
		       	{postingNodes}
		    </div>
		);
	}
});

var PostingElem = React.createClass({
	render: function() {
		return (
			<div className="col-xs-8 col-md-7">
				<div class="posting">				
					<h1>{this.props.data.title}</h1>
					{this.props.data.text}
					<h4><small><i className="fa fa-calendar"></i> Oct 23, 2014</small></h4>
				</div>
	        </div>
		);
	}
});

var PostingLink = React.createClass({
	handleLinkClick: function(e) {
		this.props.linkClickHandler(e, this.props.link);
		return;
	},		
	render: function() {
		return (
			<li>
				<a href={this.props.link} onClick={this.handleLinkClick}>
					<strong>{this.props.title}</strong>
				</a>
			</li>
		);
	}
});
      
var PostingForm = React.createClass({
	handleDelete: function(e){
		e.preventDefault();
		var postingId = this.refs.postingId.getDOMNode().value.trim();
		var text = this.refs.text.getDOMNode().value.trim();

		if (!postingId) {
			return;
		}
		
		this.props.onPostingDelete({"postingId": postingId, "title": postingId, "text": text});		//read up on when to use props vs state		
		
		this.refs.postingId.getDOMNode().value = '';
		this.refs.text.getDOMNode().value = '';
		this.refs.title.getDOMNode().value = '';
		
		return;
	},
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
		this.refs.title.getDOMNode().value = '';
		
		return;
	},	
	render: function() {
		return (
			<div className="col-xs-8 col-md-7">
				<h1>Blog Postings Admin</h1>
				<form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label for="posting_id" className="col-sm-2 control-label">Posting Id</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="postingId" ref="postingId"/>
						</div>
					</div>
					<div className="form-group">
						<label for="title" className="col-sm-2 control-label">Title</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="title" ref="title"/>
						</div>
					</div>
					<div className="form-group">
						<label for="text" className="col-sm-2 control-label">Text</label>
						<div className="col-sm-10">
							<textarea className="form-control" rows="3" id="text" ref="text"></textarea>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<button type="submit" className="btn btn-primary" id="submit" value="Post">Submit</button>
							&nbsp;&nbsp;&nbsp;
							<button className="btn btn-danger" id="delete" onClick={this.handleDelete}>Delete</button>
						</div>
					</div>					
				</form>
			</div>
		);
	}
});
