import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useGlobalState } from './GlobalState';
import { FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../menuitems/MenuItemTools';
import { useAuth0 } from '@auth0/auth0-react';
import CardWrapper from './CardWrapper';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

// Because this is an inframe, so the SSR mode doesn't not do well here.
// It will work on real devices.
const Simple = ({ deviceType }: any) => {
  const [modelData, setModelData]: any = useGlobalState('modelData');
  const [updatePage, setUpdatePage]: any = useGlobalState('updatePage');
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [properties, setProperties]: any = useGlobalState('properties');
  const [addReportModalIsOpen, setAddReportIsOpen]: any = useGlobalState('addReportModalIsOpen');
  const [propertyData, setPropertyData]: any = useGlobalState('propertyData');
  const [description, setDescription]: any = useState('');
  const [showCardFeature, setShowCardFeature] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  function closeAddReportModal() {
    setAddReportIsOpen(false);
  }

  const handleClick = (e: any, id: any) => {
    setUpdatePage(true);
    setModelName(e.target.id);
    getModelProperties(id);
    closeAddReportModal();
  };

  const handleOnMouseOver = (e: any) => {
    e.currentTarget.style.backgroundColor = 'gray';
    // e.currentTarget.style.transform = 'scale(2)';
  };

  const handleOnMouseLeave = (e: any) => {
    e.currentTarget.style.backgroundColor = '#edf2f7';
    // e.currentTarget.style.transform = 'scale(1)';
  };

  async function getModelData(modelId: any) {
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };

    await axios.get(`${baseURL}/api/Models/${modelId}`, { headers: headers }).then(response => {
      setDescription(response.data.description);
    });
  }

  async function getModelProperties(modelId: any) {
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };

    await axios.get(`${baseURL}/api/Models/${modelId}`, { headers: headers }).then(response => {
      setProperties(response.data.properties);
    });
  }

  const handleInfoOver = (e: any, id: any) => {
    getModelData(id);
    e.currentTarget.style.color = 'blue';
  };

  const handleInfoLeave = (e: any) => {
    e.currentTarget.style.color = 'black';
  };

  return (
    <Carousel
      swipeable={false}
      draggable={false}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      keyBoardControl={true}
      transitionDuration={500}
      containerClass='carousel-container'
      removeArrowOnDeviceType={['tablet', 'mobile']}
      deviceType={deviceType}
      dotListClass='custom-dot-list-style'
      itemClass='carousel-item-padding-40-px'
    >
      {modelData.map((model: any, index: number) => {
        return (
          <CardWrapper key={model.id}>
            <div
              key={index}
              onClick={e => {
                handleClick(e, model.id);
              }}
              onMouseOver={e => {
                handleOnMouseOver(e);
              }}
              onMouseLeave={e => {
                handleOnMouseLeave(e);
              }}
              style={{
                height: '200px',
                backgroundColor: '#edf2f7',
                border: '1px solid #edf2f7',
                marginRight: 5,
                marginBottom: 20,
                cursor: 'pointer',
                padding: '0 5px'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  zIndex: 5,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                id={model.name}
              >
                {model.name}
                <span
                  style={{
                    position: 'absolute',
                    top: 150,
                    left: 0,
                    bottom: 0,
                    right: 20,
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'right'
                  }}
                >
                  <FaInfoCircle
                    title={description}
                    onMouseOver={e => {
                      handleInfoOver(e, model.id);
                    }}
                    onMouseLeave={e => {
                      handleInfoLeave(e);
                    }}
                  />
                </span>
              </span>
            </div>
          </CardWrapper>
        );
      })}
    </Carousel>
  );
};

export default Simple;
