import jsonPlaceholder from '../apis/jsonPlaceholder';
import _ from 'lodash';

// We keep our isolated action creators to split up logic and have small and easily maintaned action creators
export const fetchPosts = () => async dispatch => {
    const response = await jsonPlaceholder.get('/posts');
    
    dispatch({ type: 'FETCH_POSTS', payload: response.data})
};

// We keep our isolated action creators to split up logic and have small and easily maintaned action creators
export const fetchUser = id => async dispatch => {
    const response = await jsonPlaceholder.get(`/users/${id}`);
     
    dispatch({ type: 'FETCH_USER', payload: response.data}) ;
};

// Action creator inside another action creator (Calling both fetchUser and fetchPosts)
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    // Awaits the result here before moving on the fetchUser call
    // We need to dispatch this function, so Redux Thunk picks it up and invokes the function
    // Whenever we call an action creator inside of another one, we need to make sure we dispatch the called action creator
    await dispatch(fetchPosts());
 
    // Now has info about fetchPosts, so we can use this info to call fetchUser. 
    // _.map get's an array of all the userIDs
    // _.uniq returns only the first occurence of each element, in this case, only 1 unique ID per posts, even though we have 10 posts for each ID.
    const uniqueUserID = _.uniq(_.map(getState().posts, 'userId'));
    uniqueUserID.forEach(id => dispatch(fetchUser(id)));
 };
 

// Hard syntax and not very understandable. (Problem: Not a reusable action if we want to make another actioncreater that doesn't want the 1 call per parameter restriction)

// export const fetchUser = id => dispatch => _fetchUser(id,dispatch);

// const _fetchUser = _.memoize(async (id, dispatch) => {
//     const response = await jsonPlaceholder.get(`/users/${id}`);
//     dispatch({ type: 'FETCH_USER', payload: response.data}) ;
// });
