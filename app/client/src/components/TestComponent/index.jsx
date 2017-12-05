import React, { Component } from 'react';
import { Segment, Label, Grid, Image, Header, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import { addRecentArticle, fetchRecentArticles } from '../../modules/recentArticles';

const mapStateToProps = ({
  recentArticles: {
    articles,
  },
}) => ({
  articles,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addRecentArticle,
  fetchRecentArticles,
}, dispatch);

const socket = io.connect('http://localhost:5000/client');

class TestComponent extends Component {
  componentDidMount() {
    this.props.fetchRecentArticles();

    socket.on('newArticle', (article) => {
      this.props.addRecentArticle(article);
    });
  }

  render() {
    const { articles } = this.props;

    return (
      <div>
        <Segment>
          <Label as="a" color="red" ribbon style={{ marginBottom: '1rem' }}>Top News</Label>
          <div className="scrollable-section">
            {
              articles.map((article) => (
                <div>
                  <Grid>
                    <Grid.Row className="article-item">
                      <Grid.Column width={6} className="article-info" style={{ padding: '1.3rem !important' }}>
                        <Image src={article.topImageUrl} href={article.url} target="_blank" />
                      </Grid.Column>

                      <Grid.Column width={10} className="article-info">
                        <Header as="h4">{article.title}</Header>
                        <p> {article.summary[0]} </p>
                        {article.categories.map((category) => (
                          <Label as="a" size="small" style={{ margin: '0.14285714em' }}> { category.label } </Label>
                        ))}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Divider section />
                </div>
                ))
            }
          </div>
        </Segment>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestComponent);