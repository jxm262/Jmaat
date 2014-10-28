/** @jsx React.DOM */
var HomeBox = React.createClass({
	loadPostingsFromServer: function(){
		$.ajax({
			url: "/posting/java_design_patterns",  //this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data[0]});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
//	handlePostingSubmit: function(posting) {
//		//shortcut to quickly update ui without waiting for ajax (its duplicated in callback anyway)
//		var newPostings = this.state.data.concat(posting);
//		this.setState({data: newPostings});
//		$.ajax({
//			url: "../posting/save",
//			dataType: 'json',
//			contentType: 'application/json; charset=utf-8',
//			type: 'POST',
//			data: JSON.stringify(posting),
//			success: function(data) {
//				this.setState({data: newPostings});
//			}.bind(this),
//			error: function(xhr, status, err) {
//				console.error(this.props.url, status, err.toString());
//			}.bind(this)
//		});
//	},	
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadPostingsFromServer();
	},		  
	render: function() {
		return (
			<div className="adminBox">
				<Posting data={this.state.data}/>
				
				<div className="col-xs-4 col-md-offset-1 col-md-4">
					<h1></h1>
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h3 className="panel-title">Code Snippets and Such</h3>
						</div>
						<div className="panel-body">
							<PostingList data={this.state.data} />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var Posting = React.createClass({
	render: function() {
		return (
			<div className="col-xs-8 col-md-7">
				<div className="posting">
					<h1>{this.props.title}</h1>
					{this.props.text}
				</div>
			</div>
		);
	}
});

var AdminBox = React.createClass({
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
			<div className="admingBox">
				<PostingForm onPostingSubmit={this.handlePostingSubmit}/>
				<div className="col-xs-4 col-md-offset-1 col-md-4">
					<h1></h1>
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h3 className="panel-title">Code Snippets and Such</h3>
						</div>
						<div className="panel-body">
							<PostingList data={this.state.data} />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var PostingList = React.createClass({
	render: function() {
		var postingNodes = this.props.data.map(function (posting) {
			return (
				<ul>
		        	<PostingLink title={posting.title}>
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

var PostingLink = React.createClass({
	render: function() {
		return (
			<li>
				<a href="#">
					<strong>{this.props.title}</strong>
				</a>
			</li>
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
			<div className="col-xs-8 col-md-7">
				<h1>Blog Postings Admin</h1>
				<form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label for="posting_id" className="col-sm-2 control-label">Posting Id</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="posting_id2" ref="postingId"/>
						</div>
					</div>
					<div className="form-group">
						<label for="title" className="col-sm-2 control-label">Title</label>
						<div className="col-sm-10">
							<input type="text" className="form-control" id="title2" ref="title"/>
						</div>
					</div>
					<div className="form-group">
						<label for="text" className="col-sm-2 control-label">Text</label>
						<div className="col-sm-10">
							<textarea className="form-control" rows="3" id="text2" ref="text"></textarea>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<button type="submit" className="btn btn-primary" id="submit2" value="Post">Submit</button>
							<button type="submit" className="btn btn-danger" id="delete2">Delete</button>
						</div>
					</div>					
				</form>
			</div>
		);
	}
});

React.renderComponent(
    <AdminBox url="comments.json" />, 
	document.getElementById('page')
);
