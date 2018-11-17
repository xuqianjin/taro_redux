import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'

import {View, Text, ScrollView} from '@tarojs/components'

import {
  AtButton,
  AtInput,
  AtForm,
  Picker,
  AtTextarea,
  AtMessage
} from 'taro-ui'
import HeightView from '../../components/HeightView'
import BaseView from '../../components/BaseView'
import ImageView from '../../components/ImageView'
import UploadFile from '../../components/UploadFile'
import {gender, careerKind} from '../../components/Constant'

import {putUserCarte, getDebugToken} from '../../reducers/userReducer'

import './style.scss'

const testimage = require('../static/image/test.jpg')

const mapStateToProps = (state) => {
  return {userReducer: state.userReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDebugToken,
    putUserCarte
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)

export default class extends Component {

  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      listdata: [
        {
          title: '手机号码',
          name: 'contactPhonenum',
          type: 'phone'
        }, {
          title: '姓名',
          name: 'name',
          type: 'text'
        }, {
          title: '性别',
          name: 'gender',
          type: 'select',
          selector: gender,
          rangeKey: 'name',
          func: Number
        }, {
          title: '公司',
          name: 'corp',
          type: 'text'
        }, {
          title: '职位',
          name: 'office',
          type: 'text'
        }, {
          title: '工种',
          name: 'careerKind',
          type: 'select',
          selector: careerKind,
          rangeKey: 'name',
          func: Number
        }
      ],
      desc: ''
    }
  }
  config = {
    navigationBarTitleText: '编辑名片'
  }
  componentWillMount() {
    // this.props.getDebugToken(1)
  }
  onSubmit = (data) => {
    const {listdata, desc} = this.state
    let postdata = {}
    for (var item of listdata) {
      if (!item.value) {
        let toast = item.type === 'select'
          ? '请选择'
          : '请输入'
        Taro.atMessage({'message': `${toast}${item.title}`, 'type': 'error'})
        return;
      } else {
        postdata[item.name] = item.func
          ? item.func(item.value)
          : item.value
      }
    }

    if (!desc) {
      Taro.atMessage({'message': '请输入个人简介', 'type': 'error'})
      return
    }
    postdata.desc = desc

    Taro.showLoading()
    this.props.putUserCarte(postdata).then((res) => {
      Taro.hideLoading()
    }).catch(err => {
      Taro.hideLoading()
    })
  }

  onChange = (item, value) => {
    let {listdata} = this.state
    let index = listdata.findIndex(listone => listone.name === item.name)
    if (item.type === 'select') {
      const {detail} = value
      listdata[index].value = detail.value
    } else {
      listdata[index].value = value
    }
    this.setState({listdata})
  }

  onDescChange = (value) => {
    const {detail} = value
    this.setState({desc: detail.value})
  }

  render() {
    const {height} = this.props
    const {listdata} = this.state

    return <BaseView baseclassname='bg_white'>
      <AtMessage></AtMessage>
      <HeightView height={20} color='transparent'></HeightView>
      <View className='headderbox'>
        <UploadFile>
          <ImageView baseclassname='headerimg' src={require('../../static/image/test.jpg')}></ImageView>
        </UploadFile>
      </View>
      <HeightView height={20} color='transparent'></HeightView>
      <AtForm onSubmit={this.onSubmit.bind(this)}>
        {
          listdata.map((item, index) => {
            return item.type === 'select'
              ? <Picker onChange={this.onChange.bind(this, item)} key={item.name} rangeKey={item.rangeKey} range={item.selector}>
                  <View className='inputpicker'>
                    <View className='left'>{item.title}</View>
                    {
                      item.value
                        ? <View className='right select'>{item.selector[item.value].name}</View>
                        : <View className='right default'>{`请选择${item.title}`}</View>
                    }
                  </View>
                  {index + 1 < listdata.length && <HeightView height={1} color='#d6e4ef'></HeightView>}
                </Picker>
              : <AtInput value={item.value} onChange={this.onChange.bind(this, item)} key={item.name} name={item.name} title={item.title} type={item.type} placeholder={`请输入${item.title}`}/>
          })
        }
      </AtForm>
      <HeightView height={50} color='transparent'></HeightView>
      <View className='button'>
        <AtTextarea value={this.state.desc} onChange={this.onDescChange.bind(this)} maxlength='200' placeholder='个人简介...'/>
      </View>
      <HeightView height={50} color='transparent'></HeightView>
      <AtButton className='button' type='primary' onClick={this.onSubmit}>提交</AtButton>
      <HeightView height={100} color='transparent'></HeightView>
    </BaseView>
  }
}