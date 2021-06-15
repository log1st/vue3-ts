<template>
    <div class="d-data__content-tab">
        <template>
            <div class="compib__row">
                <div>
                    <p class="mb-1" style="font-size: 16px; white-space: nowrap"><b>Сведения о характеристиках объекта недвижимости</b></p>
                    <p class="mb-1" style="font-size: 14px; white-space: nowrap"><b>Кадастровый номер:</b> {{ KadastrNumber || 'Нет данных' }} </p>
                    <!-- <p class="m-0" style="font-size: 14px; white-space: nowrap"><b>Зарегистрированно:</b> {{ innerOwners.find(e => e.RegDate).RegDate || 'Нет данных' }}</p> -->
                <!-- </div>         -->
                <!-- <div> -->
                    <p class="mb-1" style="font-size: 14px; white-space: nowrap"><b>Дата запроса:</b> {{ Time | formatTimeStamp }}</p>
                    <p class="m-0" style="font-size: 14px; white-space: nowrap"><b>Дата последнего запроса:</b> {{ TimeStop | formatTimeStamp }}</p>
                </div>        
            </div>
            <table class="modal-deb__table doc-tab">
                  <tr>
                    <th>
                      ФИО
                    </th>
                    <th class="width-110">Дата рождения</th>
                    <th class="width-110">Место рождения</th>
                    <th class="width-110">Граж-во</th>
                    <th class="width-110">Серия и № паспорта</th>
                    <th class="width-110">ИНН</th>
                    <th class="width-110">Дата выдачи</th>
                    <th class="width-110">Кем выдан паспорт</th>
                    <th class="width-110">Код подразделения</th>
                    <th class="width-110">Регистрация</th>
                    <th class="width-110">Дата регистрации</th>
                    <th class="width-110">Род.отношения</th>
                    <th></th>
                  </tr>
                  <!-- TABLE HEAD END -->
                  <tr v-for="(item, index) in params.debtor_tenant_profiles" :key="index">
                    <td class="width-110">{{item.full_name}}</td>
                    <td>
                        {{item.birth_date}}
                    </td>
                    <td>{{item.birth_place}}</td>
                    <td>{{citizenship || 'РФ'}}</td>
                    <td>{{item.num_of_passport}}</td>
                    <td>{{item.inn}}</td>
                    <td>{{item.date_of_passport_issue}}</td>
                    <td>{{passport_issued_by}}</td>
                    <td>-</td>
                    <td>
                      <div class="__select __select--full" data-state="">
                        <div class="__select__title" data-default="Долевая соб-ть">-
                        </div>
                        <div class="__select__content">
                          <input id="s0" class="__select__input" type="radio" name="reg-1" checked />
                          <label for="s0" class="__select__label">Временная</label>
                          <input id="s1" class="__select__input" type="radio" name="reg-1" />
                          <label for="s1" class="__select__label">Постоянная</label>
                          <input id="s2" class="__select__input" type="radio" name="reg-1" />
                          <!-- <label for="s2" class="__select__label">Временная</label>
                          <input id="s3" class="__select__input" type="radio" name="reg-1" /> -->

                        </div>
                      </div>
                    </td>
                    <td>{{item.registration_date}}</td>
                    <td>
                      <div class="__select __select--full" data-state="">
                        <div class="__select__title" data-default="Долевая соб-ть">-</div>
                        <div class="__select__content">
                          <input id="s0" class="__select__input" type="radio" name="rod-1" checked />
                          <label for="s0" class="__select__label">Сестра</label>
                          <input id="s1" class="__select__input" type="radio" name="rod-1" />
                          <label for="s1" class="__select__label">Отец</label>
                          <input id="s2" class="__select__input" type="radio" name="rod-1" />
                          <label for="s2" class="__select__label">Брат</label>
                          <input id="s3" class="__select__input" type="radio" name="rod-1" />

                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="doc-tab__edit-del">
                        <span class="doc-tab__edit"></span>
                        <span class="doc-tab__del"></span>
                      </span>
                    </td>
                  </tr>

                  

                </table>
            <!-- <div class="compib__row">
                <div class="compib__input" style="max-width: 12px">
                    <p class="owner-text-center" style="font-size: 12px;">№</p>
                </div>
                
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Собственник</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата рождения</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Место рождения</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Серия и номер паспорта</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата выдачи</p>
                </div>
                
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Вид зарегистрированного права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Доля в праве</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата регистрации права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Номер регистрации права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата, номер и основание регистрации перехода (прекращения) права:</p>
                </div>
            </div> -->
            <!-- Цикл по собственникам -->
            <div class="compib__row" v-for="(item, index) in innerOwners" :key="index">
                
                <div class="compib__input" style="max-width: 12px">
                    <div class="owner-number">{{ index + 1 }}</div>
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.FIO" :disabled="true" />
                </div>
                <div class="compib__input">
                    <ur-input  v-model="item.DateBirthDebt" :disabled="!editing" :mask="_dateMask" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.PlaceBirthDebt" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.Docno" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.DateIssue" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input  v-model="item.rightNname" :disabled="true" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.Doly" :disabled="true" />
                </div>
                <div class="compib__input" v-if="item.RegDate">
                    <ur-input v-model="item.RegDate" :disabled="true" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="emptyData" :disabled="true" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.RegNumber" :disabled="true" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.TerminationRight" :disabled="!editing" />
                </div>
            </div>
            <hr>
            <!-- Перечесление владельцев и переход прав на собственность -->
            <div class="compib__row">
                <div>
                    <p class="mb-1" style="font-size: 16px; white-space: nowrap"><b>Сведения о переходе прав на объект недвижимости</b></p>
                    <p class="m-0" style="font-size: 16px; white-space: nowrap"><b>Период владения:</b> {{'Нет данных'}}</p>
               </div>        
            </div>
            <div class="compib__row">
                <div class="compib__input" style="max-width: 12px">
                    <p class="owner-text-center" style="font-size: 12px;">№</p>
                </div>
                
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Собственник</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата рождения</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Место рождения</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Серия и номер паспорта</p>
                </div>

                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата выдачи</p>
                </div>
                
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Вид зарегистрированного права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Доля в праве</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата регистрации права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Номер регистрации права</p>
                </div>
                <div class="compib__input">
                    <p class="owner-text-center" style="font-size: 12px;">Дата, номер и основание регистрации перехода (прекращения) права:</p>
                </div>
            </div>
            <div class="compib__row" v-for="(item, index) in ownerHistoryList" :key="index">
                <div class="compib__input" style="max-width: 12px">
                    <div class="owner-number">{{ index + 1 }}</div>
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.FIO" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input  v-model="item.DateBirthDebt" :disabled="!editing" :mask="_dateMask" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.PlaceBirthDebt" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.Docno" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.DateIssue" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input  v-model="item.rightNname" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.Doly" :disabled="!editing" />
                </div>
                <div class="compib__input" v-if="item.RegDate">
                    <ur-input v-model="item.RegDate" :disabled="!editing" />
                </div>
                <div class="compitb__input" v-else-if="!item.RegDate">
                    <ur-input v-model="item.RegDate" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.RegNumber" :disabled="!editing" />
                </div>
                <div class="compib__input">
                    <ur-input v-model="item.TerminationRight" :disabled="!editing" />
                </div>
            </div>
            <!-- Кнопки управления -->
            <div class="d-data__content-row">
                <template v-if="editing">
                    <div class="btn btn-primary" @click="saveEditing">Сохранить</div>
                    <!-- <div class="btn btn-red" @click="removeDebtor">Удалить</div> -->
                    <div class="btn btn-white btn-cancel" @click="cancelEditing">Отменить</div>
                </template>
                <template v-else>
                    <div class="btn btn-primary" @click="editOwners">Редактировать</div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import isEmpty from 'lodash/isEmpty';
    import moment from 'moment';
    import { masks } from '@/mixins/masks';


    export default {
        name: 'Owner',
        props: ['params'],
        mixins: [masks],
        data() {
            return {
                KadastrNumber: null,
                Time: null,
                TimeStop: null,
                ownerHistoryList: [],
                innerOwners: [],
                emptyData: 'Нет данных',
                editing: false // флаг для редактирования
            }
        },
        mounted() {
            this.getStatusDischarge()
            this.getStatusTransferRights()
        },
        methods: {
            /**
             * Запросить данные жильцов
             * Заявка на выписку
             */
            async getStatusDischarge() {
                const data = await this.$store.dispatch('getStatusDischarge', { 
                    PaymentAccount: this.params.RashSchet
                });
                // debugger
                let Info = data.data[1].return.Info; 
                if(!isEmpty(Info)) {
                    this.setOwners(Info);
                }
                this.Time = data.data[1].return.Time || 'Нет данных'; // когда запросили
                this.TimeStop = data.data[1].return.TimeStop || 'Нет данных'; // последняя дата 
                let Status = data.data[1].return.Status; // статус 
                // debugger
                this.KadastrNumber = data.data[1].return.Info['0'].KadastrNumber
            },
            /**
             * Статус заявки на выписку о переходе прав
             */ 
            async getStatusTransferRights() {
                const data = await this.$store.dispatch('getStatusTransferRights', {
                    PaymentAccount: this.params.RashSchet
                });
                let info = data.data[1].return.Info
                
                if (!isEmpty(info)) {
                    this.ownerHistoryList = info
                }
            },
            /**
             * Возвращает новое поле заявки
             */
            getDefaultStatusDischarge() {
                return {
                    Doly: 'нет данных',
                    FIO: 'нет данных',
                    RegDate: 'нет данных',
                    RegNumber: 'нет данных',
                    DateBirthDebt: 'нет данных', // Дата рождения
                    PlaceBirthDebt: 'нет данных', // Место рождения
                    Docno: 'нет данных', // (Серия и номер документа (формат: 02 03 675654))
                    DateIssue: 'нет данных', // (Дата выдачи)
                    rightNname: 'нет данных', // Вид собственности
                    TerminationRight: 'нет данных', // Дата номер и основание прекращения права
                }
            },
            /**
             * Установить кадастровый номер
             */
            setPayloadInfo() {
                // this.KadastrNumber = info['0'].KadastrNumber
            },
            /**
             * Установить владельцев
             */
            setOwners(info) {
                let defaultStatus = this.getDefaultStatusDischarge();
                // если пустой ответ, ставим дефолтные данные
                if(isEmpty(info['1'])) {
                    this.innerOwners = [defaultStatus]    
                } else {
                // если данные частично есть - мерджим с дефолтом
                    this.innerOwners = Object.values(info['1']).map((owner, key) => {
                        for(const key in owner) {
                            owner[key] = owner[key] || defaultStatus[key];
                        }
                        return owner
                    })
                }
            },
            /**
             * Редактировать данные собственников
             */
            editOwners() {
                this.editing = true;
            },
            /**
             * Отменить редактирование
             */
            cancelEditing() {
                this.editing = false;
                this.getStatusDischarge();
            },
            /**
             * Сохранить изменения
             */
            async saveEditing() {
                for(const key in this.innerOwners) {
                    let payload = {
                        Id: key,
                        PaymentAccount: this.params.RashSchet,
                        Info: JSON.stringify(this.innerOwners[key])
                    }
                    const { data } = await this.$store.dispatch('editInfoRosreestr', payload);
                    // debugger
                    if(data['1'].return.Edit === "Complete") {
                        this.$toast.open({
                            message: 'Успешно сохранено',
                            type: 'success',
                            duration: 5000,
                            dismissible: true,
                            position: 'top-right'
                        });
                    }
                }
                this.editing = false;
            }
        }
    }
</script>

<style lang="scss">
    .owner-number {
        display: flex;
        align-items: center;
        height: 40px;
    }
    .owner-text-center {
        display: block;
        height: 24px;
        text-align: center;
    }

    .compib__row .compib__input ~ .compib__input {
        min-width: 150px;
    }
</style>