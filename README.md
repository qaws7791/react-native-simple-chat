# READMD

폴더 구조

- assets
- src
  - components
  - contexts
  - navigations
  - screens
  - utils : 이메일 정규표현식, 이미지 url 변환



## components (styled-components/native)

------

- Button : 로그인 버튼, 생성 버튼 등
- Image : 프로필 이미지
- Input: 사용자 가입 및 채널 생성
- Spinner: 로딩 화면

## contexts (createContext)

------

- Progress: 로딩 중인지 확인
- User: 사용자 정보 확인

## navigations

------

- AuthStack: 로그인 전 네비게이션 (createStackNavigator)
- MainStack: 로그인 후 네비게이션 (createStackNavigator)
- MainTab: 하단 네비게이션 (createBottomTabNavigator)

## screens

------

- Channel: 개별 채널 화면 (GiftedChat)
- ChannelCreation: 채널 생성 화면 (KeyboardAwareScrollView)
- ChannelList: 채널 목록 화면 (FlatList)
- Login: 사용자 인증 화면 (KeyboardAwareScrollView)
- Profile: 사용자 프로필 화면 (View)
- Signup: 사용자 가입 화면 (KeyboardAwareScrollView)

## utils

------

- common: 이메일 인증 및 스페이스 제거 등 함수
- firebase-auth: 파이베이스 관련 함수
- images: 파이베이스 이미지 링크 변환

