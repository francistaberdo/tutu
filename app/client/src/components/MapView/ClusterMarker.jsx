import React, { PureComponent } from 'react';
import { List, Image, Label, Grid } from 'semantic-ui-react';
import shortid from 'shortid';
import moment from 'moment';
import { Tooltip } from 'react-tippy';
import topImgPlaceholder from '../../assets/placeholder/top-img-placeholder.png';
import { DATE_FORMAT } from '../../constants';
import './styles.css';

class ClusterMarker extends PureComponent {
  state = {
    brokenImgs: [],
  };

  handleImgError = (id) => {
    this.setState({
      brokenImgs: [
        ...this.state.brokenImgs,
        id,
      ],
    });
  }

  render() {
    const {
      count,
      articles,
      $hover,
      isCredible,
    } = this.props;
    const { brokenImgs } = this.state;

    return (
      <Tooltip
        position="bottom-start"
        html={
          <List divided relaxed className="cluster-list-container">
            {articles.slice(0, 4).map((article) => (
              <List.Item key={shortid.generate()} className="cluster-article-container">
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column width={7}>
                      {$hover ? (
                        <Image
                          src={
                            brokenImgs.includes(article.id)
                              ? topImgPlaceholder
                              : article.topImageUrl || topImgPlaceholder
                          }
                          onError={() => this.handleImgError(article.id)}
                        />
                      ) : null}
                    </Grid.Column>
                    <Grid.Column width={9} className="marker-title-column">
                      <div>
                        <List.Header as="a" href={article.url} target="_blank">{article.title}</List.Header>
                        <List.Description className="article-date">
                          {moment(article.publishDate).format(DATE_FORMAT)}
                        </List.Description>
                        <Label as="a" circular className="source-label">{article.source}</Label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </List.Item>
            ))}
            <Label className="see-more-button" attached="bottom">Click marker to view more stories...</Label>
          </List>
        }
        open={$hover}
        animateFill={false}
        sticky
      >
        <div
          className={`cluster-marker-container ${isCredible ? '' : 'cluster-marker-container-not-credible'}`}
          style={$hover ? { zIndex: 10000 } : null}
        >
          <div className={`cluster-marker-container-radiant ${isCredible ? '' : 'cluster-marker-container-not-credible'} ${$hover ? 'cluster-marker-container-hovered' : ''}`} />
          <p>{count}</p>
        </div>
      </Tooltip>
    );
  }
}

export default ClusterMarker;
