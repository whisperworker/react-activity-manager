import {AuthActionsEnum, SetAuthAction, SetErrorAction, SetLoadingAction, SetUserAction} from "./types";
import {IUser} from "../../../models/IUser";
import {AppDispatch} from "../../index";
import UserService from "../../../api/UserService";


export const AuthActionCreators = {
    setUser: (user: IUser): SetUserAction => ({type: AuthActionsEnum.SET_USER, payload: user}),
    setIsAuth: (auth: boolean): SetAuthAction => ({type: AuthActionsEnum.SET_AUTH, payload: auth}),
    setIsLoading: (payload: boolean): SetLoadingAction => ({type: AuthActionsEnum.SET_IS_LOADING, payload}),
    setError: (payload: string): SetErrorAction => ({type: AuthActionsEnum.SET_ERROR, payload}),
    login: (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(AuthActionCreators.setIsLoading(true));
            const response = await UserService.getUsers()
            const mockUsers = response.data.find(user => user.username === username && user.password === password)
            if(mockUsers) {
                localStorage.setItem('auth', 'true');
                localStorage.setItem('username', mockUsers.username);
                dispatch(AuthActionCreators.setUser(mockUsers));
                dispatch(AuthActionCreators.setIsAuth(true));
            } else {
                dispatch(AuthActionCreators.setError('Incorrect login or password'))
            }
            dispatch(AuthActionCreators.setIsLoading(false));

        } catch (e) {
            dispatch(AuthActionCreators.setError("Error logging in"))
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        localStorage.removeItem('auth')
        localStorage.removeItem('username')
        dispatch(AuthActionCreators.setUser({} as IUser))
        dispatch(AuthActionCreators.setIsAuth(false))

    },
}