import React, {useState, useEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Text from '../../../components/Text';
import Picker from '../../../components/Picker';

import colors from '../../../constants/theme';
import {Container} from './styles';

import {
  logout,
  updateUserRequest,
} from '../../../store/modules/profile/actions';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile.user);
  const loading = useSelector(state => state.profile.loading);

  const [email, setEmail] = useState(user.email);
  const [selectedClassYear, setSelectedClassYear] = useState(
    user.curso_ano || 1,
  );

  const classYear = ['1', '2', '3', '4'];
  const {id} = user;

  useEffect(() => {
    if (!(user.email && user.curso_ano)) {
      showMessage({
        type: 'info',
        message: 'Complete seu perfil',
        description: 'Por favor, preencha seu e-mail pessoal e ano de curso.',
        duration: 3000,
      });
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Container>
        <Text h1 bold style={{marginVertical: 50}}>
          Perfil
        </Text>
        <Text gray style={{marginBottom: 5}}>
          Matricula
        </Text>
        <Text style={{marginBottom: 15}}>{user.matricula}</Text>
        <Text gray style={{marginBottom: 5}}>
          E-mail do SUAP
        </Text>
        <Text style={{marginBottom: 15}}>{user.email_suap}</Text>
        <Text gray style={{marginBottom: 5}}>
          Curso
        </Text>
        <Text style={{marginBottom: 15}}>{user.curso}</Text>
        <View>
          <Input
            label="E-mail pessoal"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            style={{marginBottom: 10}}
          />

          <Picker
            label="Ano"
            items={classYear}
            selectedValue={selectedClassYear}
            onValueChange={value => setSelectedClassYear(value)}
          />
          <Button
            style={{height: 44, alignSelf: 'stretch', marginTop: 20}}
            loading={loading}
            onPress={() =>
              dispatch(updateUserRequest({id, email, selectedClassYear}))
            }>
            <Text white>Salvar</Text>
          </Button>
          <Button
            style={{height: 44, alignSelf: 'stretch', marginTop: 5}}
            colors={[colors.accent, colors.accent2]}
            onPress={() => dispatch(logout())}>
            <Text white>Sair</Text>
          </Button>
        </View>
      </Container>
    </SafeAreaView>
  );
}

Profile.navigationOptions = {
  tabBarLabel: 'Perfil',
  tabBarIcon: ({tintColor}) => (
    <Icon name="ios-person" size={32} color={tintColor} />
  ),
};