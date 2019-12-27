import React from "react";


class TabYoutube extends React.Component {

 	render() {
        var youtubeUrl = this.props.youtubeUrl;
        youtubeUrl = youtubeUrl.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        var youtubeId = youtubeUrl[2] !== undefined ? youtubeUrl[2].split(/[^0-9a-z_\-]/i)[0] : youtubeUrl[0];
		return (
			<React.Fragment>
				<div
                    className="video"
                    style={{
                        position: "relative",
                        paddingBottom: "56.25%" /* 16:9 */,
                        paddingTop: 25,
                        height: 0
                    }}
                    >
                    <iframe
                        style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                        }}
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        frameBorder="0"
                    />
                    </div>
			</React.Fragment>
		);
	}
}

export default TabYoutube;