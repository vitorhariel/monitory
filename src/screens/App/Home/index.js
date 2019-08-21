import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  FlatList,
  Modal,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {format, parseISO} from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import Icon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import PropTypes from 'prop-types';

import Header from '../../../components/Header';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import ImportantWarning from '../../../components/ImportantWarning';
import NewsCard from '../../../components/NewsCard';

import {api} from '../../../services/api';
import colors from '../../../constants/theme';

import {Container} from './styles';

export default function Home({navigation}) {
  const [showNews, setShowNews] = useState(null);
  const [news, setNews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const user = useSelector(state => state.profile.user);
  const isAdmin = user.admin;

  async function getNews() {
    const response = await api.get('/news');

    const newsData = response.data.map(newsDataRaw => ({
      ...newsDataRaw,
      formattedDate: format(
        parseISO(newsDataRaw.createdAt),
        "d 'de' MMMM 'as' HH:MM",
        {
          locale: ptbr,
        },
      ),
    }));

    setNews(newsData);
  }

  useEffect(() => {
    getNews();
  }, []);

  function refreshNews() {
    setRefreshing(true);

    getNews();

    setRefreshing(false);
  }

  async function handleDelete(id) {
    try {
      await api.delete('news', {
        data: {
          id,
        },
      });

      const newDataNews = news.filter(n => n.id !== id);

      showMessage({type: 'success', message: 'Noticia deletada com sucesso.'});
      setNews(newDataNews);
      setShowNews('');
    } catch (err) {
      showMessage({type: 'danger', message: err.response.data.detail});
      setShowNews('');
    }
  }

  function handleConfirmDelete(id) {
    Alert.alert(
      'Confirmacao',
      'Tem certeza que deseja deletar essa noticia?',
      [
        {
          text: 'Nao',
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => handleDelete(id)},
      ],
      {cancelable: false},
    );
  }

  function renderNews() {
    return (
      <Modal animationType="slide" visible={Boolean(showNews)}>
        <Image
          source={{uri: showNews && showNews.banner}}
          style={{height: 200, width: '100%'}}
        />
        <View style={{margin: 10, flex: 1}}>
          <Text h1 black bold>
            {showNews && showNews.title}
          </Text>
          <Text gray>Postado: {showNews && showNews.formattedDate}</Text>
          {isAdmin ? (
            <Button
              style={{height: 26, width: 110}}
              colors={[colors.accent, colors.accent]}
              onPress={() => handleConfirmDelete(showNews.id)}>
              <Text white>Deletar</Text>
            </Button>
          ) : null}
          <Text style={{marginTop: 10}}>{showNews && showNews.content}</Text>
        </View>
        <Button
          gradient
          onPress={() => setShowNews('')}
          style={{
            height: 44,
            alignSelf: 'stretch',
            marginLeft: Platform.OS === 'ios' ? 15 : 10,
            marginRight: Platform.OS === 'ios' ? 15 : 10,
            marginBottom: Platform.OS === 'ios' ? 30 : 15,
          }}>
          <Text white>Fechar</Text>
        </Button>
      </Modal>
    );
  }

  return (
    <Container>
      <Header />
      <View style={{paddingHorizontal: 30, paddingVertical: 20}}>
        {user.email && user.curso_ano && user.curso_turno ? null : (
          <ImportantWarning
            content="Voce ainda não configurou seu perfil. Clique aqui."
            onPress={() => navigation.navigate('Profile')}
          />
        )}
      </View>
      <View style={{paddingHorizontal: 0, paddingVertical: 10}}>
        <Text
          h3
          style={{
            paddingBottom: 10,
            paddingHorizontal: 30,
            fontFamily: 'SFProText-Medium',
          }}>
          Noticias
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={news}
          onRefresh={() => refreshNews()}
          refreshing={refreshing}
          ListEmptyComponent={
            news ? (
              <Text gray style={{fontSize: 12, paddingHorizontal: 30}}>
                Ainda nao ha nada aqui.
              </Text>
            ) : (
              <ActivityIndicator
                size="large"
                style={{
                  marginHorizontal: 40,
                  marginVertical: 20,
                }}
              />
            )
          }
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <NewsCard
              title={item.title}
              desc={item.description}
              tags={item.tags}
              banner={item.banner}
              onPress={() => setShowNews(item)}
            />
          )}
        />
      </View>
      {renderNews()}
    </Container>
  );
}

Home.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({tintColor}) => (
    <Icon name="ios-home" size={32} color={tintColor} />
  ),
};

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
