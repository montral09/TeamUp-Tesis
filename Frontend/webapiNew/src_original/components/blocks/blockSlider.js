import React from 'react';
import { Link } from 'react-router-dom';
import RevSlider, { Slide, Caption } from 'react-rev-slider';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class BlockSlider extends React.Component {
 	render() {
		return (
			<RevSlider config={config}>
			    <Slide
			        src="images/slider-01.jpg"
			        alt="slidebg1"
			        data-bgfit="cover"
			        data-bgposition="center center"
			        data-bgrepeat="no-repeat"
			        slideProperties={{
			            'data-transition': "fade",
			            'data-slotamount': "7",
			            'data-masterspeed': "1000"
			        }}
			    >   
			        <Caption
						class="tp-caption tp-fade tp-resizeme"
						data-x="50"
						data-y="459" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:0px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						<Link to="/shop"><img src="/images/banner-02.jpg" alt="" /></Link>
			        </Caption>
			        <Caption
						class="tp-caption tp-fade tp-resizeme"
						data-x="538"
						data-y="459" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:0px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						<Link to="/shop"><img src="/images/banner-03.jpg" alt="" /></Link>
			        </Caption>
			        <Caption
						class="tp-caption tp-fade tp-resizeme"
						data-x="928"
						data-y="30" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:0px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						<Link to="/shop"><img src="/images/banner-01.jpg" alt="" /></Link>
			        </Caption>
			        <Caption
						class="tp-caption jewelry_1 tp-fade tp-resizeme"
						data-x="50"
						data-y="101" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:-50px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						2019
			        </Caption>
			        <Caption
						class="tp-caption jewelry_2 tp-fade tp-resizeme"
						data-x="50"
						data-y="201" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:-50px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						COLLECTION
			        </Caption>
			        <Caption
						class="tp-caption tp-fade tp-resizeme"
						data-x="50"
						data-y="272" 
			            data-frames='[{"delay":300,"speed":900,"frame":"0","from":"y:-50px;opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"y:50px;opacity:0;","ease":"Power3.easeInOut"}]'
						style={{ whiteSpace: 'nowrap' }}
			        >
						<Link to="/shop" class="btn">See products</Link>
			        </Caption>
			    </Slide>
			</RevSlider>
		);
	}
}

const config = {
	sliderType:"standard",
	jsFileLocation:"./rev_slider/js/",
	dottedOverlay:"none",
	delay:9000,
	startwidth:1240,
	startheight:668,
	hideThumbs:200,

	thumbWidth:100,
	thumbHeight:50,
	thumbAmount:1,
	
							
	simplifyAll:"off",

	navigationType:"none",
	navigationArrows:"none",
	navigationStyle:"round",

	touchenabled:"on",
	onHoverStop:"on",
	nextSlideOnWindowFocus:"off",

	swipe_threshold: 75,
	swipe_min_touches: 1,
	drag_block_vertical: false,
	
							
							
	keyboardNavigation:"off",

	navigationHAlign:"center",
	navigationVAlign:"bottom",
	navigationHOffset:0,
	navigationVOffset:20,

	soloArrowLeftHalign:"left",
	soloArrowLeftValign:"center",
	soloArrowLeftHOffset:20,
	soloArrowLeftVOffset:0,

	soloArrowRightHalign:"right",
	soloArrowRightValign:"center",
	soloArrowRightHOffset:20,
	soloArrowRightVOffset:0,

	shadow:0,
	fullWidth:"on",
	fullScreen:"off",

	spinner:"spinner0",
	
	stopLoop:"on",
	stopAfterLoops:0,
	stopAtSlide:1,

	shuffle:"off",

	autoHeight:"off",
	forceFullWidth:"off",
	
	
	hideTimerBar:"on",
	hideThumbsOnMobile:"off",
	hideNavDelayOnMobile:1500,
	hideBulletsOnMobile:"off",
	hideArrowsOnMobile:"off",
	hideThumbsUnderResolution:0,

							hideSliderAtLimit:0,
	hideCaptionAtLimit:0,
	hideAllCaptionAtLilmit:0,
	startWithSlide:0	
};

export default withTranslate(BlockSlider);