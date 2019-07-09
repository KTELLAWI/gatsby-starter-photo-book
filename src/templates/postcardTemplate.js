import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import theme from "../theme.yaml"
import { FaTimesCircle, FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { GlobalStateContext } from "../components/globalState.js"
import { CornerCaseHandler } from "../components/cornerCaseHandler.js"
import { maybeEnterFullScreen } from "../util/fullScreenHelpers.js"

class PostcardTemplate extends React.Component {

  constructor(props) {
    super(props)

    /* If the user has had time to look at placeholder (e.g. first image that they open, or slow connection),
     * then we want to transition from placeholder to real image. If the real image is already cached
     * (e.g. subsequent images on fast internet connection), then we want to snap to real image. */
    this.longTransitionDuration = 1000
    this.snapTransitionDuration = 0
    this.thresholdTimeToLookAtPlaceholder = 200

    this.state = {
      currentImageLoaded: false,
      zIndexes: this.zIndexes(),
      userHasHadTimeToLookAtPlaceholder: false
    }
  }

  zIndexes() {
    /* Trying to reduce hidden dependencies. */
    const z = {}
    var next = 1
    z["prefetchedImages"] = next++
    z["currentImagePlaceholder"] = next++
    z["currentImage"] = next++
    z["invisibleLinks"] = next++
    z["navButtons"] = next++
    return z
  }

  componentDidMount() {
    this.timerID = setTimeout(
      () => this.setState({
        userHasHadTimeToLookAtPlaceholder: true
      }),
      this.thresholdTimeToLookAtPlaceholder
    );
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearTimeout(this.timerID)
    }
  }

  render () {
    const c = this.props.pageContext

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Photo ${c.image.id}`}</title>
          
          <style>
            {/* 
                Set some CSS attributes into html and body tags of this page.
                We do this here because a Gatsby bug prevents us from doing it the clean way
                (which would be: using separate CSS files for setting separate html/body attributes to different pages).
            */}
            {`
              html {
                height: 100%;
                overflow-y: hidden !important;
                overflow-x: hidden !important;
              }
              body {
                height: 100%;
                background-color: #fcf7e9;
                margin: 0 0 0 0;
                background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E");
              }
            `}
          </style>
        </Helmet>
        <GlobalStateContext.Consumer>
          {globalState => (
              <>
                  <CornerCaseHandler g={globalState} currId={c.image.id} nextId={c.image.nextId} />
                  

                  {/* Invisible helper links for prev/next navigation: clicking left side of the viewport links to prev, right side to next. */}
                  <Link to={`/images/${c.prevId}`} onClick={maybeEnterFullScreen} >
                        <span style={{ position: "fixed", height: "100%", width: "25%", left: "0px", zIndex: this.state.zIndexes["invisibleLinks"] }}></span>
                  </Link>
                  <Link to={`/images/${c.nextId}`} onClick={maybeEnterFullScreen} >
                        <span style={{ position: "fixed", height: "100%", width: "25%", right: "0px", zIndex: this.state.zIndexes["invisibleLinks"] }}></span>
                  </Link>

                  {/* Visual cues that the user can navigate to prev/next.
                    * (Even though clicking anywhere on the page works, we want to help the user understand what they can do). */}
                  <span className="arrows">
                    <Link to={`/images/${c.prevId}`} onClick={maybeEnterFullScreen} >
                      <FaArrowCircleLeft style={{ left: "10px" }} />
                    </Link>
                  </span>
                  <span className="arrows">
                    <Link to={`/images/${c.nextId}`} onClick={maybeEnterFullScreen} >
                      <FaArrowCircleRight style={{ right: "10px" }} />
                    </Link>
                  </span>

                  {/* Top right 'x' to 'close' the image and return to gallery. */}
                  <span className="x">
                    <Link to={`/#id${c.image.id}`} state={{ highlight: c.image.id }} >
                      <FaTimesCircle className="x" style={{ right: "10px", top: "10px" }} />
                    </Link>
                  </span>


                  {/* Display current image. */}
                  <img
                    className="currentImage"
                    src={c.image.l.originalImg}
                    srcSet={c.image.l.srcSet}
                    sizes={c.image.l.sizes}
                    alt=""
                    title={c.image.title}
                    importance="high" /* Resource prioritization hint. */
                    onLoad={() => this.setState({ currentImageLoaded: true }) }
                  />
                  {/* Display placeholder over current image until current image is loaded. */}
                  <img
                      className="currentImagePlaceholder"
                      src={c.image.l.tracedSVG}
                      alt=""
                    />

                  {/* Preload next 2 images (hide with CSS).
                    * Why like this, and not with link rel prefetch?
                    * Because link rel prefetch sometimes eats bandwidth from current image.
                    * This way we guarantee all bandwidth to the current image and only begin
                    * fetching next images once the current image has fully loaded. */}
                  {this.state.currentImageLoaded && (
                    <>
                      <img
                        className="prefetchedImages"
                        src={c.prefetch1.originalImg}
                        srcSet={c.prefetch1.srcSet}
                        sizes={c.prefetch1.sizes}
                        alt=""
                        importance="low"
                      />
                      <img
                        className="prefetchedImages"
                        src={c.prefetch2.originalImg}
                        srcSet={c.prefetch2.srcSet}
                        sizes={c.prefetch2.sizes}
                        alt=""
                        importance="low"
                      />
                      <img
                        className="prefetchedImages"
                        src={c.prefetch3.originalImg}
                        srcSet={c.prefetch3.srcSet}
                        sizes={c.prefetch3.sizes}
                        alt=""
                        importance="low"
                      />
                    </>
                  )}

                  <style jsx>
                    {`

                        img {
                          position: absolute;
                          margin-left: auto;
                          margin-right: auto;
                          margin-top: auto;
                          margin-bottom: auto;
                          padding: 0;

                          left: 5%;
                          right: 5%;
                          top: 3%;
                          bottom: 3%;
                          max-height: 94%;
                          max-width: 90%;

                          @media only screen and (max-width: 1200px) {
                            left: 0px;
                            right: 0px;
                            top: 0px;
                            bottom: 0px;
                            max-height: 100%;
                            max-width: 100%;
                          }

                        }

                        .currentImage {
                          -webkit-box-shadow: 1vw 1vh 5vh 0px rgba(0,0,0,0.75);
                          -moz-box-shadow: 1vw 1vh 5vh 0px rgba(0,0,0,0.75);
                          box-shadow: 1vw 1vh 5vh 0px rgba(0,0,0,0.75);
                          border-radius: 8px;

                          opacity: ${this.state.currentImageLoaded ? 1 : 0};
                          transition: ${this.state.userHasHadTimeToLookAtPlaceholder ? this.longTransitionDuration : this.snapTransitionDuration}ms ease-in-out;

                          z-index: ${this.state.zIndexes["currentImage"]}
                        }

                        .currentImagePlaceholder {
                          height: 1337%;
                          border-radius: 0px;

                          z-index: ${this.state.zIndexes["currentImagePlaceholder"]}
                        }

                        .prefetchedImages {
                          opacity: 0;
                          z-index: ${this.state.zIndexes["prefetchedImages"]}
                        }

                        .arrows {

                          :global(svg) {

                            bottom: 50vh;

                            @media only screen and (max-width: 1200px) {
                              bottom: 10px !important;
                            }
                          }
                        }

                        :global(svg) {
                          position: fixed;
                          font-size: 40px;
                          fill: ${theme.color.brand.primary};
                          opacity: 0.4;
                          z-index: ${this.state.zIndexes["navButtons"]}
                        }

                        :global(svg):hover {
                          opacity: 1;
                        }
                        
                    `}
                  </style>
              </>
        )}</GlobalStateContext.Consumer>
      </>
    )
  }
}


export default PostcardTemplate
