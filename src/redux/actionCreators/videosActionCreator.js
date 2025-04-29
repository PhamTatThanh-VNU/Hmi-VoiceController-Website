import axios from 'axios';

const setVideosLoading = (data) => ({
  type: 'SET_VIDEOS_LOADING',
  payload: data,
});

const setVideos = (data) => ({
  type: 'SET_VIDEOS',
  payload: data,
});

const setPopularUploads = (data) => ({
  type: 'SET_POPULAR_VIDEOS',
  payload: data,
});
 
// fetch videos from api 
export const addVideos = () => (dispatch) => {
  dispatch(setVideosLoading(true));
  axios
    .get(import.meta.env.VITE_APP_Youtube_API, {
      params: {
        channelId: 'UCA_23dkEYToAc37hjSsCnXA',
        order: 'date',
        part: 'snippet',
        type: 'video',
        maxResults: 36,
        key: import.meta.env.VITE_APP_Youtube_API_Key,
      },
    })
    .then((res) => {
      dispatch(setVideos(res.data));
      dispatch(addPopularVideos());
    })
    .catch((err) => {
      console.log(err.message);
      dispatch(setVideosLoading(false));
    });
};

// fetch popular videos from api
export const addPopularVideos = () => (dispatch) => {
  axios
    .get(import.meta.env.VITE_APP_Youtube_API, {
      params: {
        channelId: 'UCA_23dkEYToAc37hjSsCnXA',
        order: 'viewCount',
        part: 'snippet',
        type: 'video',
        maxResults: 36,
        key: import.meta.env.VITE_APP_Youtube_API_Key,
      },
    })
    .then((res) => {
      dispatch(setPopularUploads(res.data));
      dispatch(setVideosLoading(false));
    })
    .catch((err) => {
      console.log(err.message);
      dispatch(setVideosLoading(false));
    });
};
