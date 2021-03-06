import React, {useState, useEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Text from '../../../components/Text';
import Picker from '../../../components/Picker';
import Switch from '../../../components/Switch';

import ThemeContextConsumer from '../../../ThemeContextProvider';

import {getThemeColors} from '../../../constants/theme';
import {Container} from './styles';

import {
  logout,
  updateUserRequest,
} from '../../../store/modules/profile/actions';

export default function Profile({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile.user);
  const app = useSelector(state => state.app);
  const loading = useSelector(state => state.profile.loading);

  const colors = getThemeColors();

  const [email, setEmail] = useState(user.email);
  const [selectedClassYear, setSelectedClassYear] = useState(
    user.curso_ano || 1,
  );
  const [selectedClassTurn, setSelectedClassTurn] = useState(
    user.curso_turno || 'Matutino',
  );
  const playerId = app.oneSignalPlayerId;

  const classYear = ['1', '2', '3', '4'];
  const classTurn = ['Matutino', 'Vespertino', 'Noturno'];
  const {id} = user;

  useEffect(() => {
    if (!(user.curso_ano || user.curso_turno)) {
      showMessage({
        type: 'info',
        message: 'Complete seu perfil',
        description: 'Por favor, preencha seu ano de curso e turno.',
        duration: 3000,
      });
    }
  }, []);

  const cursoAnoStringCondition =
    user.curso_turno === 'Noturno' ? 'Período' : 'Ano';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <Container colors={colors}>
          <Text black h1 bold style={{marginTop: 10, marginBottom: 20}}>
            Perfil
          </Text>
          <Text gray style={{marginBottom: 5}}>
            Matricula
          </Text>
          <Text black style={{marginBottom: 15}}>
            {user.matricula}
          </Text>
          <Text gray style={{marginBottom: 5}}>
            E-mail do SUAP
          </Text>
          <Text black style={{marginBottom: 15}}>
            {user.email_suap}
          </Text>
          <Text gray style={{marginBottom: 5}}>
            Curso
          </Text>
          <Text black style={{marginBottom: 15}}>
            {user.curso}
          </Text>
          <View>
            <Input
              label="E-mail pessoal (opcional)"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              style={{marginBottom: 10}}
            />
            <Picker
              label={user.curso_ano ? cursoAnoStringCondition : 'Ano/Período'}
              items={classYear}
              selectedValue={String(selectedClassYear)}
              onValueChange={value => setSelectedClassYear(value)}
              style={{marginBottom: 10, color: 'red'}}
            />
            <Picker
              label="Turno"
              items={classTurn}
              selectedValue={selectedClassTurn}
              onValueChange={value => setSelectedClassTurn(value)}
            />
            <ThemeContextConsumer>
              {context => {
                const {handleToggleDarkMode, isDarkModeActive} = context;

                return (
                  <Switch
                    label="Modo escuro"
                    value={isDarkModeActive}
                    onValueChange={handleToggleDarkMode}
                    style={{marginTop: 10}}
                  />
                );
              }}
            </ThemeContextConsumer>
            <Button
              style={{height: 44, alignSelf: 'stretch', marginTop: 20}}
              loading={loading}
              onPress={() =>
                dispatch(
                  updateUserRequest({
                    id,
                    email,
                    selectedClassYear,
                    selectedClassTurn,
                    playerId,
                  }),
                )
              }>
              <Text white>Salvar</Text>
            </Button>
            <Button
              style={{
                height: 44,
                alignSelf: 'stretch',
                marginTop: 5,
                marginBottom: 8,
              }}
              colors={[colors.accent, colors.accent2]}
              onPress={() => {
                dispatch(logout());
                navigation.navigate('auth');
              }}>
              <Text white>Sair</Text>
            </Button>
          </View>
        </Container>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function ProfileIcon({tintColor}) {
  return <Icon name="ios-person" size={32} color={tintColor} />;
}

Profile.navigationOptions = ({screenProps}) => ({
  tabBarLabel: 'Perfil',
  tabBarIcon: ProfileIcon,
  tabBarOptions: {
    style: {
      backgroundColor: screenProps.theme.darkMode
        ? screenProps.theme.background2
        : screenProps.theme.white,
      height: 58,
    },
    activeTintColor: screenProps.theme.primary,
  },
});

ProfileIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
