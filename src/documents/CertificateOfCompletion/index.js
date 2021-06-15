import Vue                    from "vue"
import pdfMake                from "pdfmake/build/pdfmake"
// import pdfFonts            from "pdfmake/build/vfs_fonts"; // default styles
import htmlToPdfmake          from "html-to-pdfmake"
import pdfFonts               from "../fonts/custom-fonts.js"
import chunk                  from "lodash/chunk"
pdfMake.vfs = pdfFonts.pdfMake.vfs

pdfMake.fonts = {
  TimesNewRoman: {
    normal: 'times.ttf',
    bold: 'timesbd.ttf',
    italics: 'timesi.ttf',
    bolditalics: 'timesbi.ttf'
  }
}

function formatString (str) {
  return str.replace(/(<\/[^>]+>)/g, "$1\n\r").replace(/<!---->/g, '\n\r')
};

function getDebtorDefaultReport (rasShet) {
  // let DateFiltrStart = dates.DateFiltrStart;
  // let DateFiltrStop = dates.DateFiltrStop;
  $http({
    data: {
      command: 'DefaultReport',
      rasShet: rasShet
    }
  }).then(({ result }) => {
    return result.PeniLogs  
  }) 
}

const Component = Vue.extend({
  template: `
  <div>
    <table>
      <tr style="width: 100%; border-left-width: 0pt; border-top-width: 0pt; border-right-width: 0pt">
        <td>
          <p style="text-align: left; font-size: 14pt"><b>Счет на оплату № 2 от 09 июня 2020 г.</b></p>
        </td>
      </tr>
    </table>
    
    <table>
      <tr style="border: none">
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0">Поставщик <br>(Исполнитель):</p>
        </td>
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0"><b>ООО "ЮРРОБОТ", ИНН 9715367395, КПП 771501001, 127282, Москва г, Студёный пр-д, дом 4, корпус 1, Э 1 ПОМ V К 17 ОФ 60</b></p>
        </td>
      </tr>
      <tr style="border: none">
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0">Заказчик:</p>
        </td>
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0"><b>ИП Ассоров Владислав Алексеевич, ИНН 507503595865, р/с 40802810570010135796, в банке МОСКОВСКИЙ ФИЛИАЛ АО КБ "МОДУЛЬБАНК", БИК 044525092, к/с 30101810645250000092</b></p>
        </td>
      </tr>
      <tr style="border: none">
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0">Основание:</p>
        </td>
        <td>
          <p style="text-align: left; font-size: 9pt; margin: 0"><b>Основание: Договор на оказание возмездных услуг №02/06/20-БГ/СБ/Квс</b></p>
        </td>
      </tr>
    </table>
      
    <table>
      <tr>
        <td style="text-align: center; font-size: 9pt">№</td>
        <td style="text-align: center; font-size: 9pt">Товары (работы, услуги)</td>
        <td style="text-align: center; font-size: 9pt">Кол-во</td>
        <td style="text-align: center; font-size: 9pt">Ед.</td>
        <td style="text-align: center; font-size: 9pt">Цена</td>
        <td style="text-align: center; font-size: 9pt">Сумма</td>
      </tr>
      <tr>
        <td style="text-align: center; font-size: 9pt">1</td>
        <td style="text-align: left; font-size: 9pt">Тариф «Судебная Практика» по договору №02/06/20-БГ/СБ/Квс. За лицевой счет</td>
        <td style="text-align: center; font-size: 9pt">792</td>
        <td style="text-align: center; font-size: 9pt">шт.</td>
        <td style="text-align: center; font-size: 9pt">250,00</td>
        <td style="text-align: center; font-size: 9pt">198 000,00</td>
      </tr> 
      <tr style="border: none">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-align: center; font-size: 9pt">Итого:</td>
        <td style="text-align: center; font-size: 9pt">198 000,00</td>
      </tr>
      <tr style="border: none">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-align: center; font-size: 9pt">Без налога (НДС)</td>
        <td style="text-align: center; font-size: 9pt">-</td>
      </tr>
      <tr style="border: none">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-align: center; font-size: 9pt">Всего к оплате:</td>
        <td style="text-align: center; font-size: 9pt">198 000,00</td>
      </tr>
    </table>
    
    <p>Всего наименований 1, на сумму 198 000,00 руб.</p>
    <p>Сто девяносто восемь тысяч рублей 00 копеек</p>
    
    <p>Оплатить не позднее 15.06.2020</p>
    <p>Оплата данного счета означает согласие Заказчика с условиями оказания услуг:</p>
    
    <ol>
      <li>сполнитель обязуется оказать Заказчику услуги, а Заказчик обязуется их принять и оплатить.</li>
      <li>Сведения об оказываемых услугах содержатся в настоящем счете.</li>
      <li>Оплата услуг осуществляется Заказчиком путем безналичного перевода денежных средств на расчетный счет Исполнителя с обязательным указанием в платежном поручении реквизитов настоящего счета.</li>
      <li>Заказчик обязуется оплатить услуги в размере 100% в течение 3 рабочих дней.</li>
      <li>Исполнитель обязуется оказать услуги в течение 5 рабочих дней со дня поступления оплаты на расчетный счет.</li>
      <li>Приемка оказанных услуг осуществляется путем подписания Заказчиком и Исполнителем акта об оказании услуг.</li>
    </ol>
    <th></th>
  
  </div>`,
  data() {
    return {
      contractNumber: '30/04-LUJ/2020'
    }
  },
  // props: ['company', 'companySharedData']
})

export default async (propsData = null, action = 'open') => {
  // const { company, companySharedData } = propsData;
  // const peniLogs = await getDebtorDefaultReport(debtor.RashSchet)

  let html, el; 
  if (typeof document !== 'undefined') {
       el = document.createElement('DIV')
  }
  const vm = new Component({
    propsData: {
      // company: company,
      // companySharedData: companySharedData,
      // debtor: debtor,
      // peniLogs: peniLogs
    }
  })

  vm.$mount(el)
  await vm.$nextTick(() => {
    html = vm.$el.outerHTML
  })

  const formattedDomString = formatString(html)

  const data = htmlToPdfmake(formattedDomString, { tableAutoSize: true })


  const docDefinition = {
    content: [
      data,
      {
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACZAkQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9UhXHePvC83ii80OGOMrDDc+Zc3AYDEOPnix1Ik4Bx6ZrsK4/UPi54L03ULiyvPFGl2t3buY5YZrpVZGHUEE9aTt1Gr9CjefDS6uLHUNOj1+aDSbySWT7MLdCy+a++QFzyerbfTdznApni74fPrVzGts7hb3UEuLyYlfkgESxyRAEZIkVQp9NxPYVZX40eApM7fGGitjr/psf+NTL8X/A+P8AkbNGH/b7H/jSvEv3je0nQxpMkxinYxTTyXDxso+85BwD2Ax+tatcb/wuLwKoO7xhogA65v4hj/x6nD4v+BuMeL9EPf8A5CEX/wAVRddybM685pa5H/hbXgpsAeLNFyen+nxf/FVKnxR8HuuV8UaOw9Rfxf8AxVHMu4cr7HU0d65lfib4Rbp4n0c/9v8AF/8AFVIvxG8Kv93xJpLfS+i/+Ko5l3FZnRdqPWue/wCFgeGWHHiLSv8AwNj/APiqQePvDTPtHiPSi3Xb9tjz/wChUcy7hZnRUdqwl8baA2Ma7pp+l5H/AI08eMdCYHGt6ef+3qP/ABp3QWZtcUi9qxl8X6E3TWtPP0uo/wDGnjxRpDAEarYkf9fKf40aBY1/WkYcis1fEWlt01KzP/bdf8am/tmx4/023P0lX/Gi6CxdoqqNTtW6XER+jinfb4M/66M/8DFFwsyx6UVELqHj96n/AH0KX7RH2dT+IoAkpCcUwyKecj86TcCtMCTuTSc4HpXKeLfil4U8CLnW9cs7F8gLC0gaViegCDLE/QV494o/bZ8MaX5KaL4Y8T+JJbi8bT4PsunNFHLOoJKBpNuSMHPpg+ldlHBYnEW9nTbuS2k7H0YvNL74r5Qb9tDxHfeG7fWNH+GTXiXMMtxBbza5bpLIsQzIoRdx3j+7jNWLf9szX7GznvPEHwn1fS7G3so7+e5iv4JUjiclRnkHcGBBUDPFdv8AY+N25PLdf5hddz6kLHv0pQR+NfOHgz9vL4ZeMLyCykfVNHuppVgjW8smKs54ADJn9a920DxTpHiq1FxpGo2+oQkkboJAcEdQR1B+tcmLy7GYGVsTScfVDUlLZmz26VG305pdrEUm0+lefqUSLT6YO3GKfmqEwo70gPNL3oEBpaQ0tACCiik55oAVhmmqD26UZPenLQA0/eop3eigApMD0paBQAgpe1AooAWkpaSgA70dqO9HagA9aTv0pfWigBGHHTvSKvzGnUAdaADA9Ka30p1HHNADP4qMbh0pWAzSr0oAQKOuOaXaOMilFHpQAxlHPFNZQCOKkZc5ppWgdyJh3pF6091wpzTAvNIpWFUZbNSAfLTF7VKuOaYmGOelG3pTu9FBIUUUdqACigUUAJ2qnJpdpI7M9rC7Hks0akn9Ku9qbt65oApf2Hp//Plbf9+V/wAKY/h3S5OW060b/egU/wBK0DTS2M0Bczf+EZ0f/oFWP/gMn+FI3hHRGOTo+nk+ptU/wrRXk1KO1KyAxm8F6A33tE04/W0j/wAKY3gXw2/3tB0xvrZxn+lbppaLId2c03w78Knr4b0g85/48Yv/AImmN8NfCTcHwvoxH/XhF/8AE109M/WiyC7OYPwy8HY/5FXRf/BfF/8AE1HH8K/BWSw8J6GrdMjTos/+g107dKF4z6Ucq7FanMf8Kp8FD/mU9E/8F8X/AMTSH4SeCW6+EdDP/cPi/wDia6lvl5JFctffEbS4ryWx01bjX9RjJDWumJ5mw+jvkIh/3mFLl7IV33Gn4P8AgYrj/hENDx/2D4v/AImm/wDCn/Ay8f8ACI6Jj/rwi/8AiaXd4y1pAVGn+G4m/vg3s4/AFEU/iwp//Cu7a+fdq+q6rq7d0mujFF9PLi2KR9QarlQ7vuZmpeBPhno+432i+HbQ9f30EKn9RWSLL4WSNuttD02+Pb7Dphmz/wB8Ia7uy8H6DpLeZa6TZW7qMCRYV3Y+uM1W1b4geF/DKt/aGu6bY7OqSXKKR+Gc1SinsrhqcSNJ+H8+CngS4Ix94aFKv/soqObSPhqG/wBI8Hz2/ctJotwB+YStub4+eC1haaHUZr2JFLtJZ2U0yKoBJJZUwBgHnNdvourWviDS7PUrKTzbO8hSeGTBG5GAKnB5HBpyp8qvKNh3kjzWx8HfCfXLj7Pb6fpD3B/5YljHJ/3ySDWv/wAKH8A8sPDdqCf7rOP5NXXatoOnaxCY76xt7xD/AAzRhv518lftV/tLQ/s4smg+Abj7d4ouImaTSpyZ7a0UjCucnKtnBCA4I6gV3YDLa2aYiOFwsbzf9a9iXK2rZ3Pxmn+C3wS09Jdb0r7Rqk6t9k0fTpZpby5PoqK+QP8AaOAPWvlrVr688eeNNLsvE9pP8E/DF9b3EtisGoTC7uZEfb5UsrnahChn6YIK4J610Pw/Wz1b+zNU8Iofih8UfENvLdXOq6hF8tq4YqPOJZlt1j3MuF4dWwATXq+l/C3wX4R1iDxH45nj+IPi5ZfszQwAHTNOmRF+RISTukVNo3NukIXOBivraOHwmUOUKkOapqttb7aReiV+stX0MZOUtnofO/hz4Qj4nXF9J4I+HWoXEdzpVjc2PiI3UqR2+orKWd/tE7lnyp5I3dK9gh/Zgl8NWs2p+IvEfh3wmsF5HcyOLy8vZY2aModzNLGivISxLKgyWNe6eH/El78RPCthfW919ivNJ1CKea1tZDb2kkKyAOjYONoUEqC2ThSQAcVV+waZcPrlhBPHrthqH2jdLommtPdO0khdN8/3B5ZLAZPOR0xXBXzeu3yRXIo/N/e9PwDlT1Z4o37GXw+s9R1GSX4ma5a3tjZz3E/2UBEt4nUySsmQ20lZMkKc4YcVKv7FOi6pos0ukfFbxAFvtPNuZNZEjsLWIgYALIQoJB56k5716b42k0z/AISu4fUfDPiCK51+2ksxGxs4wUaMQu7NuYgYKjDELnHFXrjwPbzQaXaar4N8SBNNgMFtc262bxxIZUkb93A4GTsUcL0rP+0cZFxqe1f3R/yHypqx8p61/wAE5/Gnh9ftOialp3iwRXIdPLvZrOYYPT72Aw7nOeOMV5J8TPC+t/BHxZbG61XxZ4Z1B7htl4bm6XKcrkSMwV+dnQng81962Njb6dq922n+JtUuru5OJNEvpHsLlmkuWluPI83YFyuxRtPRDzk5roma88QPD4M8UaTomp2Plq8tjrkvm3M8Ls5whOVYxRqu5ucnPIxk/S4Xi2vGcfr1ONWC30Sf+X4HPLD9YOx8X/Bb9p27W6j07x3L4u1+1/fyvqukapc+fBFEAWd4kYAoAcluD9a+2/Bfgjwl8QvD1trfhvxz4m1LTLlcxzW+vzMPoQTkEdweRXg2i/A9PDv2jxz8DrO3uLG/R473wr4kgYvcRxuCRaSyE4QuFPdWAXDDiuP8O6xqfgvWr7xz8N5bqz1aFJJvEPhLU3jhW8dJP3zNESNkgVi5ZflRdi/NmubN8NludV5V8tj7PbTz7NfZ12a0NacpwXLUZ9jJ8D7RGyni/wAYqf8AsNyEfqKlHwYVPueNfGAPvqpb+a1F8B/j14Y/aA8Fw+IfDlxkcLc2cuPNtpO6sP5Hoa9MzX53Ww8qFSVKrG0lujo5mecj4RXKt8nj7xcv/b7Gf5xUq/CXUUY7PiJ4sH+9Pbt/OGvRqO9Y8qDmZ5z/AMKs1yP7vxJ8T4/2haN/OCm/8Ky8TL9z4m+IP+B21mf/AGjXpBpafKg5meb/APCuvFo+78S9X/4FYWZ/9p07/hBPGirhfiReH/f0q1P/ALKK9EprZp8qDmZ52PBfjxcY+IzH/f0WA/yIpw8I/EBRx8QLdv8Ae0OP+kgr0Lmilyq4czOAXw38Q1z/AMVtpr+m7Q/8JqH0D4j4/d+L9GJ/6aaI39JxXoApG+9RyoLnnraP8T0xt8TeHJP97R5l/lPTX0/4qKy7Na8KsO+/TLjn8puK9H7U2lyoLnnDQ/FiMfJd+EZj6tb3Sf8As5pm/wCLiqMJ4Odu/wA10o/rXpYPSmn60cvmPmPOlufiuo+ax8JyH/Zublf5oaSTUviqg+XQfC8p/wCwlOv/ALSNejqcCl3U+XzFfyPOjrnxNj6+FNBkP+zrMg/nBSDxN8SV+/4J0l/+ueuH+sNeiU0evFK3mPTsef8A/CWfEFc7vAVqw/2NbT+sdOXxn44Xlvh82f8AZ1iE/wAxXZar4g03Q4/M1C/trJP71xKqfzNYv/CyNKucDT47zViTgGxtJJF/77xt/Wq5WK/kY48f+MFA8z4cXx558vUrVv5sKU/EjxIgy3w51zPolzaN/wC1a1l8Va5dPttvCd2idpLy6hiB/AMx/SlF54wmJK6Vo9uP+ml/I5/SIU+R9x/Ixx8UNZA/efDzxIv0+zN/KWl/4WpeLnf4G8Tp3/49o2/lJWs0njXqLbQsf3fOm/ns/pSNqPjO3XP9iaRc+0epyIT9Mw0cj7hoZDfF4xsA/g3xUv007dj8mpy/GC3Vcv4Y8UIPfSnP8q0l8Ya3arnUfCV7GO7WNxFcgfhlWP8A3zWhpfjrR9VuhaJc/Zr0/wDLrdo0Mv4KwBP4Ucsg07GFF8YtNYZbRfEUXGcPo8/9Fo/4XPoagF7HXI/9/Rrkf+yV3RPpSrU69xaHBv8AGzw0pIf+1EP+1pNyP/adOX41eFSebq8T/f064H8467lsHNN444p6hocWfjN4R76my+zWswP/AKBUR+NXgpDlteiT/eikH81ruZEXH3QfwqLyYz1jU/8AARRqGhx6/GjwOwyPElmB/tEj+Yp6/GbwP0/4SjTQe26YCura1hON0UZ/4AKb9gtWzm3h/wC/Yo1Hocyvxj8DtnHizSMj1u0H9a6DQfE2l+KLRrrSdQtdSt0fy2ltZRIobAOMjvyPzqRtE09shrK2b6xL/hU1vZ29hGY7aGOBCclYkCjPrgUle+onboWd3WlqDcRmnq25aoRJRRRQIBSE9aUV43+0F8TtR+H2reCrSz1ObS7fVrq5iuJrXRJtWmKxwF1CwQgvjIGWAOBSGlzOyPYWxjINRhea8Z8F/Ha4sfBdneeOrC60y9bTb7VPtMlk1qtxBbzbQfJc745HjaN/LbkbiOoxW7a/HjRLjxLfaC9tdwanp8QuL6KTZ/osH2dJmlfDZ2jeqcDJY8AgZpcyK5WemL7VJ6V5FcftFaNp/hu91i/0fVtPjh06LVoLe6SJZLm1kdUWRfnwvzMuVcqRkZFaFv8AHjRrqJkt7K9u7/8AtMaTDZ2vlStcXHk+cRG6v5ZCx5LEsMbSDzRzLuHK97HppNIWArzS++O2jQeH7HVbXTtU1T7Ut2zWlpFH58H2YlbgSB3UAowKnBPPTNQa9+0Z4Q8N2D3V9NdxgJp7JCsG+SQ3m7yVVQTkgKzN2UAknAo5kLlZ6fu3GnKa80vPjxo2leIPEumalpmraZH4dshqOo6jcQR/ZordvM2OGVyzbvJkwAueOQMimD9oLwzJoF7qcSX08lpe22ny6fDCrXPnXBQQKAG2nd5in73HOcEYo5kHK+x6RIRxmuf8VeOLDwhBCtwJLq/uiUtNOtV33Fy+OiL6erHAHUkVyTftBeGV0wXNzHeadO01/bi2v41icS2iF5VYhiBwOOeat/CXw21zp8fjHWZkv/EWtQrOZ15S2gYbkgi9FUEZI+8ck1tFLl52Nprcnj8Iaz41UzeL7n7JZOQyaDp0pEaj0mlGDIfUDC/XrW7Jr3hfwVbJZvqGlaNBH8qwvNHCB7YyK6PIri9X+DngXXr66vNS8J6TfXdzJ5k009qju7epJHWrjKLfv3t5C9Tzr43ftg+DPg74fgvIriPxLe3MpihtNLk83BAyS7IG2j8K810P9rhPiRrtlpcPjez0Ge7wHs9E0iW9lgyhPzTSgKTkbcLGeTjtXq/xWsfB3wK+Hup+ILDTv7MmiAhsrWwYqbi5c7Y4lj5UlmI4x6mvnP4N+FtZ+DOieP8AxDearZ33j3Um+xRJLASxuX2F9pHQLLPGhJGMrjivscDhcurYKpUcXzrSN38TbXSzSUb3NFa17HpNp8SvhBrjSP4g8SeLtdVdQ/slZtTt74W1xc52lEWKMITnIxjsfSvfdG+Hfha10+1fRtEsbCIlZFZLRUdh2zuXd+fNfG2ufHfTPhzqVld3nh6+l8NfD3T/ACtL+zKZbTVtXnJi+0NMowqDEgDsOWdyMkDPTfBv9vDVPECXjeI9AuNSX7RE27QbCaYW1u0ZLO2xWyAw2jnJOemDWNfJMbKi8TQg+Rd2uu1reWr9bDcX0PsHWPDWn+INNOn39us9kzKz2+SEkwc7WA+8vqDwe9aUaLAiogCooACgYAHoK8H0n9sDwhJFoSaw66RqGq6bNqwsvPWaSCBWAiV1XkyybhtjUE9fSsDw3+3F4WurfTjr4g0yabRX1m7W2mNwbb5v3dvtVSzTFPmK/wAOOa+fWX4uWipt/wBf8AjklY6T9rf9oyL4B/D9nsI1vfFWpZg020BHynoZn9FXP4nAr81vhz8P/FXx2+KklhaTNcahfSG/1TU5SWFpHn95NIT37Be5wBWV8XP2gNS+P3xMvfE0w3madbPTtKgVpJEg3ERxqoGWds5OB1Y19mfCPwbqPw7+GVp4U0mw1Dw3f67tvPE2vTWZfVTHIrKFt7MZkEakLHuIyuWIXncP2ujRjwXlKkkvrVbr/L/wI9luzgknUnZ7I6/9mXT9I8IfCe28PeCr+Yy2OqTf2vfWtjuvpoW8xoZgjqdysTHyAeM4xXdyR6fc6XdR2+iR3+sGNbvWLVCIrGyuEViZpSn/AC1ZDgxqSWHBwOarfD/whLpsEfh3w6JtO1CeKObUryROdGgaNUEMAbLLJIEVgjE7AST/AAg+wReDLHw/4JutC0O2jtIjbSxxhstudlOXcnlmJOSSckkmvx3G4pVsVKtdtyd7vc6ltY4D4WrpXjpbga7m81zS2j83TJnX7PbK6B4mSFfkAKnjO4jBG41H4i/aU0Dw3bvLZRWM2nx3IsozLfx2zzSbtp8tCPujBO5yoIHHGDTfgDpcc1r4lvQt3HM/2fTSb5ovPPkwADcYxjjfgZ5wOfSvAvC/woHjbw74o8MeOtQ8SCNry3uLHTltmmuLOWAPGUDFSuxxgrkBSrA54NddHCYepWqOvJqMeXRb6729CJSaSsfQ3ikt8UvDWkeMvC88k5tYbiJ9OkB2zxyrskUqOrrgMuDhscH5ga6j4P8AiWfxB4Ydbqea7msp2tVurmDyJJ0XG2Rk/hJ6duQeBXnnwTudO+HemazLfa7F9j/0OxtrNplZnmgt0ikMfPzln+X5eCUo8AW2tX9x8SPE9na/2dpWtea8Mbz7t80cKxq8eB8oyr7myQzcrkDceKtSSU6a+GL91vz6FJ9T1e21bw746k1PT18jVDYyeTcxSw5CtyOCwwRkEZHGQfSuf1f4e3mmWso8Ozi4tXjaKXRtUdnhkjYYZY5eXiJGQMEr7d6x/wBnnQzpej3oS5t72yt4rbTrS5s93lSxxR5ZssMljJJJuPrx2r1rr1rzan7qbjF3RR4Il5q+j6xrXiXRrMS32n6Z9kTwvdOIHtEVRsQdV8oMGcyJncMDBwMcZ8YvgbD+0d4bvWS3bw94/tbK2N+bG4VI9Tt3IkNtM6ZGGKHAOdvH3ga+gPiNoenXWl/2tPqEOhX2njdBq0xAWLJAKPnho2JAKnrn1wa8zsvGCXnh908NGHR/7NM39s2/h/yGZboKpiJd/lWFxubeR0wCRg13YfFTozjVo6SX9a9xctz5gh+Op8K/EiDWdD0iXT/GWlwrb6n4L0m2dII7CLcZxdzyKiB0PKMvHAAyDmv0B8C+NNK+IXhPS/EWiXK3em6hAs8Mi/3WGcH0Ir5U+PHgHwz8Q9OtPH4im1i2tGtrfxRpVlO1pbXYDKVuJNyfvI0OecFWjJIJ21T/AGbfiBc/Cv4wf8ILrF1ZCy8VrJqNvY6XARY6TdZO23ilHysHiCtx0I5AzivosdSoZnhVXw6tOC1W+i3Xy3V+nVvZJ62PtZaO9NVh60u4Z618QUKaWo2mRWVSygtwoJ5PHan7h60AFI1CsGwQcj2paAGtk47Ui081geMvGujfD/Q5dY1++XT9NjeOJpmRnO+RwiKFUFiWZlAAHU0vMDdH3qVq5/wn440jxtb3E+kzTyxwP5cnn2k1uQ2M8CRFJ47it/cvc0ALmikZl7GgMB1NMAPahs4pNwOOaGYetACfyoLYBpM5+tcX8XtYvNI8D3Rsbn7DdXU0Fkl0OsHnSrGZB7gMSPfFEYuclFDSuP1r4igalPo3h6xbxFrUJ2zRROI4LUkf8tpTkLwc7QC3+zSQ+F/EOtKW1/X2t4m62GiqYEHsZTmRvqNv0rb8LeF9O8H6LBpmlwCC2iHXOXkbu7seWYnkk8mrt3qllYOi3V5BbO/3VmkCk/TJrXTaA/JHh3ib42fC/wCEfi8+GTpWoX3iX5VENppsl1PKxXcFWRuXOOeCcVvTftKeH7DXrPRLnRPENtq15H5lvZNp26WRcZOFViRgA9fStv4reO/DPg3wfqnie7k0y5u9MgaS08x42fziNqKp6gliBx614H+yz8M4NB8TaH/a+oQ6p4osbCTWNZvPNDs19eMfLizuJxHH5nHTL54r3KOHw8sNKvUjJW033f3aJafeXaNrs9tk/aK8PW2tQ6PPpXiKHV5YGuksTpEpmaFWCmTaATtBIGfU1YP7QXhxOZNP8RRqejf2FdMD7/KhrzDx9rsmny/ETxrZkHX9Uli8FeG03nLFWKuygdD58kpJHaFfSvdfhz4RtfAHgnRPDtvI0iadaJDvdizOwHzMSeSS2T+NcFalSp01Ozu/Py1/RCaSObX9oTwapxNcala+rXGj3aAfiY6hvv2mvhnpcZe98WWdmME4uEkjJA9AygmvTiEPoarTabZTyLLLawySKMK7xgkA9cHFcalS6p/f/wAAnQy/BvjjRviBoUWtaDdm+0yYlY5/JeMPg4JAdQSPfpV3WNB0/wAQWbWuoWsdzEegdeVPqD1B9xV5UVBtQBR2ApM7etZXV/dF6HEeD9QvPDfiSfwhqV498Fg+16Zdzn95JBna0bH+Jozt+bqQwzzXd9OteYeOprxfjN8NI7RG8tl1E3bqM4iEK4U+gLlTn2r0/wBK1qK3LJdUN9xfWmrn0o55p2MViIKjbvT6jkzmgEN9AeaUUnpilC8d6Ch+7NGabtPpS7cEUCDbn2qTbtpv8RwKev3eaCRaKTnmigBN1Y+reFtN1jXtG1i7hMl/pDStZyByBGZE2PwODlTjmtjjtUbZ3HvQGp5n8WvhZefFDxF4MSdrKLw9o+orql2WMn2mZkB2QrghfLYkF92chcY5yN64+E3hy61681iSzdr68maW4fzWxLutxbsjDOChjABXpkA9RXYLmnrS5VuXzO1rnl0f7OvhX+zNTsbh9Vvor61isfMvL+SWS3t43DpDEzfcUMoPqcDJOKsTfAnQ2a4nS91aLU5b5dRXU0u/38Myw+TuT5doBjJUjbzk5zXpQopcq7C5meGr+y7Yx6jMY/FXiGz00ac+nwWtrdKG/fSNJdyyOyMXkmdlLNxjbxjNXND/AGZfDtpD9o1S4vNV1uTR7TRZtQeXaTDbsShReisc4ZhyQMV7I1FHKiuZ9zitc+E2g+IrjxVNfwzTf8JJYQabfKZPlMMXm7No7HMznP09KxIPgZYrZaba3euarfQWeqw6uyv5EYnkhA8lHEca/IrKr4GCSOSeleoZG2helDS6k8zPJ9a/Z78P6vd2N39rvobi01G+1KNsQyr5l2u2YFJEZSuOnGRmq3hX4SeIfhFo9rpvgfXf7Q0W2XC6T4hJcLySRHMgygyeF2lR0AAr11mHpSK3JxWkZcuiK5nseUXnxyu/D9xJba34R1ATxnY50d1vF3emPlP6VTj/AGpPDm7ZJ4d8YRNnHzeH7g4/Ja9mNJkY6Vtz0raw/EWnVHzz4o+L/gbx1qvh+/1Dw14uvm0S6a8tIX0eWOLzthQOwcAEqGOM9Cc1iapcfDrxFp3iK0l+HviZ08RXSXl/I48l5XRgy4kMoKKGGdoIHJ45r6i464pVUZHFaxxKgkopq3n8x3Pljx38O9C+LOnx2b+DtC0SCO0Syhk1TUmKwxofkxbwHaSuTtJbIycGvSPgb4H8I/A7wLH4bsNat7pPOkmlmkcDczsWIUZO1QScLmvYNooMa91H5VdTH4idD6tzPkve3mTzHnGkeF/hXoepR6hp+l+GbO/jkeZLqKCFZVdvvMGxkE4rxP8Aa48R+GNN8B6R4C8NatpPhmTxfqfk3F1ZogWKDO+4kYJ/e+UEnru5NfWLQx/3FP4V8H/tMeIrjxJ+0Pq9npFx4gin8P6LFZC80FE2WDzMZZHn3EFgwWJQiYY5OORXp5HTqYjGqUnfkV/u2+5tETlZEnwZ0fwPrXxqm8QSf8ImdJ8EW7y/2xo+1FuriQDyl8sE5aJUlY9TuYY4xXpGi/EjSPE1xqXj57iw1KaOVrDQoW1CO4imnMuyOSAEiSAMwyysPurnpXN/D+HWNL/Zc0nxZMv2fxL4i1A6/qF5bacZ1yx2wh4gwkICLCPl3NkDIOTXq3gnR7nxB8QNLtdbsraabR7D+2LiRINqC4uS8UEfzKGLJDHKTuAOZK68zrSqVZObvy+7vfbe3q/+GJikkd54HbQ/CegR20uvWF5qEzGe+vGuIw1zcMBvkPPrwB2AA7V5t4r+Nes+CPG0EMupaXqmlXF7j+zguLp7YjAktWViJCnLOrDdgEjjFe4t4d0lj82mWbH3gQ/0rE8TfDTw54osktrrS4Y1Ri0ctqohljJUqSrLgjIJH418zQqQU71ldMt+R5DovhvxH4O1/Wtd8I61pV5omvXb6m2ni4XdI0gBV0DgBflAyAwz1rhNB1lfjv4+1nSPGF9ZWWo6Ncm3eOL90IozErqrFJMuc+ZksxX5eFrtX+BfizwneDQPD13pl74QvG2r9tsIxNp8eAHQOCGIIyRtAOT1HWuRs/h74O+GPxm1yaS00OUz20Uaw6qkcMMzokeVUbNkZ/eLtOCxO4c19Nh6lKUakr3ny+60tdLLX5Gb6GN8fvh74XHw1ubXwd5fiQaX5N+ttahHhEkM0eIlaMBRvVnXaDnp6V6Rda58QfHfw5tLPQIbPS9P1K3Ft/aFgsKTWS7dpCJ57LwQVzngDoa6B7H/AIShbaODwdZ2+k2zLO1vbWyosxU5VTLIiKEyATtDZxXDeFvBPirw7Z6VL4b8L+G9WsdZtVnSGW0WK3tWJyNzoCBsQgbgPnwOAeax+surh406lnKLbV/P/hrj2lpse1654+8P/CvSdI067uLm8upAkEFrZQPdXU2CFMhRATjJBZjgDPvW34S8X2fjLS5L6zWWFEuJbdo7hQrq6MVYEAnuK8z0P9ntZ9Ra+8Q/2Y8klw1zL/ZtsYpXDRhPIMox+5GM7QB0HPUn0e1+GvhSxtUt7bw9p0ECfdjjt1UD8hXz1X2aVou8u/Q006jvGmjz+INDjs7by2k+2Wkzb2wNsdxHI347UNeS/GrwBrP2zV/Eem2sM8MibLyNZSHltlhxyMgHY+XGc4weOa9c/wCEC8N9f7Esgf8AriKZJ4D8NyK8Z0WzKuNrL5YwRWFOThK49jweaDxpa/EBtD1vWbLWNK8QWtxbR2cFwkb+XIibCsIyzKoWTLscYJwOa+e/EfgL4g/8JHc+A5rfxFcTeF5JDoF7p7RraRqI2axkkYyD51RNrcAda+tNJ+EfhjVIZLbVo3sm8N37gSWkzWzSxBd0BkkUhyojfaRuAODnNeafG7wbo114+8BeMtAt4da0PVrWawnsk1drW0vsLvhZuqykAyYVhj8sV9TluJ5Krgluu3VL17ES2udv8Pdf8Y+PvCNj4q0t7m5j1CxEqRvcIqmQRRKUzvIBEqTZwo+8Tk9K7ZdG8dWdldOupJdTyXikxy4G2IzKzeURwAFLqA3OFHevKf2SrDQbyPx94Xgk0+5ttH12Se0TRL+R7aGC4USiNCGGAr+YuMAZBr6BbwHpTcYvF/3b+cf+z14WOoPD4mVO1v8AJ6r8yr3OT8faB4l1bxPbatpsMDQ6KkctrFIx33EjPmYLhgATEvlgt/faun8Zrqep+FLu10mIpf3WLZWkbaIlZgryZHopYjHOQKd/wgOmg5EupDvxqVx/8XTm8D2f8N5qi/TUZv8A4quEdyn8P4dR0PSE0jUbURPaySRW7wEvF5AIMYDHnhWC88nYa67cK5r/AIQW3yCNT1hT7ajL/jXRKnlgDk/U00D3JK8p/aS8K6v4y+G4sNEtb27vk1TT7ry9NmjhuBHFdRyuY3kIUMFQ4ya9UzxQqgrQ1dWEnZ3PlTxBrnjjwF4L8V+K/EEms2+keHb2z1LRLXXb61F9e7VYXVsWgOx1cNtjVssW+gqfxd4H+JDeE/A6aU+szak5e/8AFUltfiMzW00olmsod3/LXc21GG3akbDcNwr6Z1LRbDWFhW/sre9WGVZ4hcRLII5F+665HDDJwRzVvaPSpUbGntOtjwnVvDfiDT7f4k68ljrmo6hJcrBpFlDqUsY+ytBbo7RorYUq3mtkDflWxyRXM6JpfjPVI9B8OXieKbXTpPFVzK13HJNbuumJasy+ZKZGkVTMyhVZtxx2xivp3YvpSbQe1HIhc585aT4H8VXFv8Ohe6r4tR49Xv7fUiNQlXdZq101u0/PIOIQG6kbQTzXNX3ib4k6Lp/xCv8AU9Y1C0u7DTNcuWiOny+REqOxsWhlZREGWMKflLFsndyK+sNo9OKrapptnrGnXFhfW0d1Z3MbRTQTLuSRCMFSD1BFKUb7ApW6HjvwI17XdW8QatHPd69qWgDSrCdbzXrUwt9ucSGdIsopK7RETgFQWwD1A9T8VeG7Pxf4fvtHvwTbXcRjYrwynsw9CDgg+orUht0t7eOKFFjijUKqKMBQOgFPq43j1E3d3PMNL8YeIPh3axaf4y0661Kzh/dx+IdNiMySIOjTxL88bY6kArnuKTW/AHwq+O2pWetahY6R4pv7OLyoLgS7pIUJztwpBXnPXmu31a116a7DabfWFvbbeY7m1eRt3PORIvH4VxevfCFvEkvnX1p4fa6Jyby3sZbe4B9RIkoYH8a6I1NeZaPyDzPJfEXwI8NfEL45ad4ag8FWdh4L8LxxanqN0LYBNRu2z5NuTj51RfnYdPmGa3fgf4B0nUfE3ia//wCEBttMi/ti4lfUNQ01YHdo28uCO3UjOxUQMZOhLYGeSOnj+Efj3SN39jfEGa1T+GG9ia8jXn/poS3/AI9UreGfjXboot/Gfha4bPLXOiyjI/4DL1r1KmKqTpKj7S6tbd+r+9/oXfmVrnzh+0h4LuvgPq+jeIk8V6reard3F7DobS2vnwWV1czqY0it1wry/vZWDvyxA54FVvC/7Pvx4ttYj8X+Gdb/ALKvoNMngaTxS7yXuozMrHzDCsrpGCxGAz/Kedo6V9B+IPgv43+JGl2unfEDxBpWtaZFeRXj6fpds1lHK8Th4wzne+AygnBGcV6ws/iONcDTtPbH/T44/wDadd39tVMPQjTgoylZptq91229Rc7R82eIo/2j722gvtA0qCyhh8NzWC2WratF9pa+IUi6kEaMjP8AKQihwBnLEZxWdc/ED9oXwLp93eWngPUdc0aHQrW3tV1O5t5LyO7B2zXM0cLM8p53eWmchT3NfU323X1UZ0e1Y/7N8f6x0w6prfOdAU/7t6n+FeUswVuWVGLXo/8AMObyPDbr9pzWbLxL4UgufCniDTfC81tLJqeu33hy7LXEqAARQwRBpIyzEtukUDAwATXdW/xyfxLJ9n8KeDPEusSnj7RqGnSaZbJ7s9wEJH+6rGu1Otaznnw5Kf8Adu4j/Wm/8JBqy9fDF5/wG4gP/s9ccqtOVuWFvmTp2MnwL4H1Ox1S58SeJ7yPUPEl3H5QW3BFtZQ5yIYQeevLMeWIHQACu6C4xXPL4l1LaN3hrUQfQSQH/wBqUDxRe7sHw5qigd8wnP5SVhKXM7sk6Je9Ka5z/hK7kNtPh/VgPXZGR/6HUkfiiRvvaPqifWFf6NU3QWN7bTWSsVvFIVedL1P8LYn+RoPiuIZzp+pj/tzc/wAhRdBZmwMbRT1UYNYf/CX2oxmz1Jf+3CX/AOJpf+Ewsl+9BqAz/wBOE3/xNF0FmbeOaBWGfGmnfKdl8N3rYT//ABFaOn6pBqcBmgMmwNt/eRNGc/RgDTEW+hNOXoKQMKUUAFFFFADBTG+8afTSvzdaBDhjj0p9M7Cn9qBibhnFKT0qF7VJLhJiuXQYU56ZqTvQArD0pNhpelOoAiZeMU3DLT2ams3PtQBC3cUq5XNPkI/Gow4pWKJGyelKqttFIrhuRUvagGJg0q9cUc9qVe1MQhzzRznJpx70m75gKBCfdFfmL49lv5/if8VPF1ppRnSe+1DTZdRt9Z+zTqsSKsaRw7wCVZdxZgc447V+nTdBX5TfEDwzayXGr66kHhK5uJvFeoic6hJMupokd8VJjO8RsQBwhGcHODX3PCvKqtXm6pL8fVdjOfQ+0fGGm3+gz/C/T9Ltlnh0y3t4JLY2trM6qVVBIjSuGUoVydo5HTkV6h8N7d7nVvGeqykO11rDQocdI4Yo4gP++lkP4muI+JWoWEHxS8DQtfbdSZkSCzlsYGi2tuLOZpMENtRgFQk57c5rvfhWqx+H9SA4P9sagT9TdSH+tfL15OVNNrf/ADNDscGuD+Klv4rvbW1tPD011bWs+5bq403yvtkfQqYzKwQDhgTgnkcV3uRTcjNedGXJK4HjGn6f8TpJIrSxvbqxVZJBJca41vcKIsDy9pjXcz5znOBjjNP8M/Ae+01vE9/4g19fEOsa3Aoe6+ztD5UysWR0UuwTadu3aB9wE5PNey96QV1fWpxTUbK/ZfMdjxPw/B4l8ceF9X0vVPEktw62UTQ/ZreOCSZWjwwlYDr5iSKdoXgV0vwX8RaXqWj3ul6Z5cVvp0wEFqqlDFC6q6gKQPlVmdARx8nHSuC+HFjL4f8AihqurRpL/ZWrand6fK8ysAJvNkdETPGwbDyABulIp+vahpfw48V3N8uoLaajp90SNMhtxJPe2TANhcHcFXeRyCMxjHJ576lFTcqUNb2at3JPfmzSkHFUPD/iHT/FWj22qaXcLdWVwu6OVQRnnBBB5BByCDyCK0GBxXhuLi7MZHzgZpv8VVNW1zT9DtXudTvrfT7dFLNNcyrGoA5JyTUWg+INN8V6Pbatot/Dqem3ILQ3Vs4eOQZIyCOvINVyyS5mtB2OJ8bLa6br2uPdfYvJutNguQNRgM8CvFKU3Mg5PEi/lXz7+1TcReNP2O9Qv3vYdWutH1O2nintLH7GiZmUJsj3NgBJR35Hoa+jfGkcM3jKNZ3ZIW0G8ErLAJyF8yHny8Hd34wc14N8d7+Bv2WviZ5WsaZqun2clqtuml2X2SO3G6FtrLkjzMnJ6YyBgdK+oyOSjj8NJLVTh+aXYmXws8f/AOCYOsfZviV4z0pFHl3WmQ3BcJs3MkhHTv8A6w/nX6P96/Mb/gmq8sn7QHiN9wa3/sdtpRcA/vF7nk1+nG7mvoPECnGGfVeXqov8EZUXeCBqN3rSmm1+cGwu6kekzStmgBhoTintzSBRQAm47utO5zSU4UADfWm0+k20ARdwadxjkUu0cUdAaAGsSMUYzS43d6MfhQUhpbaRSq25aGxTV44pASHoacF6U3indKBC9qKKKYgprfLk06mv0NACd+lH4Ug7UbttK40Kv6UnSk698UbeKYxdwOacSO9R5z0607b680CHjFHHNIDSigRFIxpVPHPWnMoOKTpxQAN6/wBajZj07VL7UwjmgaG+Yakjkzio9u6nRr0oKdiaigUUEDSabnmlFNb7xoAVW9qk7VHup4OaAG80dKccUnpQArLu5oAo9aC1ADGWmbctTmbnrTCec5oHditH8tQsvBp7P2pYl3gnHFAx8UO0CpqKKCRCtAXpQzU3zMAUAKw60m35gaXduWjOCKBit0r8zviF4e8aW8fxx8M6Nc6VBoOk63carcL9hlvNRdZ9s21ECFACXGHJ3KATwBX6YbulfF/xi0+18O/tPazo9zFbm08daEssXnPEgF1EDCWHm7lL7ShAEbscYxivquH67o1aiSTdr6q/wtP8rkS7nr1xdX/iy88E+IbDVtLTTJNIt9QNrq0zrGUYZd9gXaT88eGJBUqPWu9+HaraXXiixEqyqNUe7iZTwY50SUEeo3M/PtXg/wAFrV/GXwF0PT7rSLnVNS8J6hNo06m1Rb9YIyQhjFwqbSU8k5IXIBxXq3hO8utA8RaJLqsgFzqVs2l3SeajvDNGzy2yy7PlDmJnBxwSBjORXlYym6c50r/C2vxND1QrTFQhvWpCwambsN0zzXjgPz+FNOMcVxGvfHb4feF9eTRNU8X6PZ6u8ixfYpLtfNDMcAMoOVyT3xXjvjT9sXUNN1PxFD4b+Geva3pnhueSPWNWm2w28QjI37MFix2/MOnGM16dDL8ViNIQ+/Rfe7Cubun/AAm8a6x4ilvb/U5dJto9afUooUvCYtom3qohXg5UcksOWPFdb8QbP4c6f4st9Z8V6zZ6ZqclutiqXGoCDzU3llBUEE8sfbmvlbxR8YfHnir/AITrxDc/GHTPBOm+Grsy6Zo9tbRo2oRNGs1uGZjuYMjqvGcnP0rT+FmhfDP4jav8Q/EXxHtbFda1WG31O3vNenCiOzuLcFPKDMAArBuRzX008rrRj7fET0irWgtdbaa2vvq1cjmXQ9z8S/HKPwPJL4e8C/DnWvFE1nM1uI9MijgtEkwHbMjHgfODuxg7utYHjvxH8T/iR8Y28CeF/EFn4D0uz0WDVbq7MC3N1cNIxUpHk4AQjBI/rXh/g3xouseCvCyX2j+J9f0jVbea2mbwuZDJd3NjIYAXZSAqPEqNknkjmu2+G3wG+J91otp4l0e4Pw48SWl1d2ljba4RfuukzFZFjk2s2WRwSAT603gqGClJzcVJXSctfe728rdtLjTb6HM+NPhnN8Svhf498ReJTceIviT4FmazeGSd/stzFbusoY24O0mWEnPrXo/xavPE+j+Ffhrqnwghuo9GvIlki0XSLdVtlXb5yOQB0ILKVJAOfUCvTPgr8BX+Gdv4sute8RXHjHXfFMyzape3EKxI+2PYEVATgbSe9ej6Lo+meC/D9rpmnQx6dpGnQCOGJSdkUajgZPYCvOxGaRVVRhacYvRfZ1Surdk9h+h5Z8VPEk+m3niq9s75tN1Cz0WHT7e6SATeRcTs7k7SyDIVEPLDqPavEf2mPEc9r+xCz3d/b6tqmvXlvbSXi2JsJLlxKMtLEWb96Fiw3PJXsK9B8UahbX1rokOp311pFz4y1WS/M4hdYkiYCO1VnBGH2rFtBz8zEkcVhfHKXStQ8feC/A+t2Efiew8P6TLrGradDBG7XDMPLDrG0iZIHmv8uSM5xXXlLp4fE0Kso35Jc79I/wCb8xTejPGv+CXdu1x8RvG8zwqpttOgRXIO755GJHt90fX8K/Rw18qf8E/fDekW/g/xr4q0axt7LS9d8Q3C2CwwyRD7LBiJPlkJcZYSHBPBJr6rNTxbjlmOcVq8VZaL7kv1FTjyxAmkXqaGOKbu5xXyAxwHWloHSk29aBjqBSUCgAz81OFN704GgYtAooFAhMU1vu0+mtQAzB9acKTdRuoGIRg0npTs5pKA6jqVfvUbgM0bhQA6iiigQUjdDS0hoAj78UMKD14ozSAFFHajNJTKGjINSr2qL1qRTmkDQ6l20jdKVTmmSIe1J6070pD3oAj3HJpjMc4qb1prKKBoiHWnRltw9KOFyDUiLQUyRaKTbRTIEximt96nLzSetIQ3aetPXjvRS7eKYxOG5o9KKPSkAdqNv50lHSgYhWjYM0m48mnDkigBPJXrTwoVcDpQ3al9aBBR2oprGgAY0n0pu456UuaChfWk70DvRnmgY4V81ftyeANS1T4dweM/DbzW3iXwu7XEd1aD9+tsw2zBD2IGG/A19K7uKr3lrFfW01tOqywyoUdGHBUjBFd+X4yWAxVPExV+V7d11XzWhm1dWPzM/YB+L0tr4813wbr2rXZj8XxMkV5dXLNOt4qHkMxzlkPBz1Ar7BuNDbTb7VLLVZpdR1K4NjaNrFhaJb29lOhJtXcGQvJKWdSzDIwVHAr4H/aQ+Aesfs9fEW71bSmks9LXUFvdIv1wTEzHcoH+6RjHtX1h4J+IkX7T/wAH4vEegW0EHxF0l4rbVYPtHlOpUY80EkBVbqJMFlXeF5Ar9N4qy+jiHSzrBP8Ac1UlK32X0v27eqM6U7q3Y+nfAvixfFejGWaL7LqVrI1rfWbfegmXhgfY8MD3Vga8H/aN+MVt9iuR4au77+2fBN/Hrl/FCxijngt5Y0uIGOfmBScEZBHHtXQeGbi8063tdc0bUo/EetWMUdnqskL7bXVlyzCKCRj+8nhHAfnOSrHJO2PT/gH4K+JHi7XfG9lq+oG21u3mtL3S432KkksXlXCyKwLKxAjyhxhowe5r87wqw9Gs51tYrbzfZ+qNXfofPPw/0/4S2/wx+KMPj6x0nwv41vL28ma61h45r7E6ma3aJjknAYAbO4PrU/wp+HPi74yXdtbJ4j1rwn4R8XeGbXVb9rG1yt3MoFtIhlPCFlRGx/EGPBxX1vafs8+AF/sebUPDdjreoaXZR2MN/qkCTzNGgAUsSMFsAc4r0KGCK1hSKGNYokUKiIAFUDoAB0FevXz1RUnh07yd/es1H/CnfsnqTa9mz580L9jrwnpvxMs9ZvNK0/XdCs9AtdKt7fVYxPKk0BIWXkbTlODnuBxXoXjb9nf4d/ETWtN1TxF4XstSu9OhFvb+YCEWMHIUoCFIHYEcV6EmfWpOR718/PMMXUmpuo7pW3ZWhQ0XQdN8N6Xb6dpNjb6bYW67Yba1iWOOMegUDAq9tzSmlVvwrz5Nyd2MaVwnHFecfEjVrbXLxPByz+XFcQ/adYm3bVhs848tmPCtMfkA67d57V0PjTxk+i+TpulQDUfEV4pFpZ5+VR0Msp/gjXPJ79BknFcPeeFdc8LxQS2doPF8eqLINbIkSN7qZ1wrncMeUo+UKGG0c/NW9KCvdgc34bJm8V6n4l1TUbrQdP0lW1G+09gfs6IIirRS7lBynlqy9VGCV618t618bo/EVj431WTT9e0/xj40vY7PSNPvdOmt457dv3MKI7KY5sJIjFGAAJbnmu//AGnvG2p2um23wg8I3f8AwkV35y3Gtz6zdFI7wAq40xJcBPMaMDKEg7AM5LGtX9mvwxL8V/iZbaqZb2TwL8P/APRdMttQt1V21IxlWTfyZFto2EYYnlue1fe4OnDB4V46utHsttFt0+1K3yW5nLdI+oPg18OLT4S/C/w14RsuYtKs0gaTGDJJjMjn3Zyx/Gu0zQBSGvz+pUlVnKpN3bd38zQGG4U3y/en0lQAnOBS7utH3vpR2oEOpFpaQUwCm7fmzTqKGgHY70opNxNKKQCelRyKcdeKk9KU9KAI0XikPTFSbfemN9aB6CYyaXbwKVadmgQm3rSbcU496UevegAooooAKbJntTqRhnNAEXOeKcKRsqT2oDcUDCk7CgUY6GgYmOKcowaSnL1oBjhTicUgHFLQSIvakbvThR60ARMTzjimMSPrUxXFRSNQUiH5t1WI8qo5qLrmpY+1IciVTmigUUyBFakakX2pWoAMZp1N3U6gBvenelN3c0ZNAwNIW5xQ3Sm7TnNA+gdetSLxUY+9TzQSL2pfWozmpOxoAKa1OpjcmgBvTFC560jZ44oVs0FDumc0m75utMNI2OmaQrk2aCOaYp45NPpiPK/2kfgtF8bvhpe6Ekot9RUebaTkD5ZB2JxwDivzp+COj/E34NfGbVTpCQ2Euiqza22pF0sZbYMiiN3CnDMSCp7ck8A1+tbdOK8H/aJ/Z/u/HzWnifwncLYeK9OkSaS0kdls9YSM7lt7pQfmGQCpOcH2r7nIuIJYPDVcsrpOlU77Jv8Az/B6mbh73MjI8H69oPxm8DfbvCk1jp+jwgyX+iyWXn3WnXAlaSR7cKeHYlsMMjhSvoceH4pGHWW1+AyaNLeai9sNTS1L280CD5muY0PzormOJZvlfL47EH5/k8YeJE8Tya1pEC+C/H9jCLnxHNqk0ytYRo4jWCO35F1CyqOQMbju3LkV9ASfE7R/EF9DpHxIsD4I8T+QkketWrGSwdf3ixuZMYjKuzsqycBwCC2BWGJy36u+eC5ovpu1/muz7dC07ntGl/Fa1hs7V/EEK6RHOqtFqSP5unzg9GSccKD6PtNdxa3UF5Ak1vNHNE4yskbBlI9QRXg3/CK674d1u+13SHiTwz9nhtbNbeZr1DEzRxmTy14ZY4lLBcH5mPJGayfG/irwJ8GPhzF4r8SWGp6VHdal9hiufD8U1jPdFnISVooSgBYDPzDnA47V81LDqclGnq30LWuh9Jhe4pfxrx7xZbL4JsdFupfH3iyC01S+gsYSrWku1pQdpYyQEheOTnNc/pviJ/Flusmiav4m8TYmvgUuNTj09ClrKInIaGJSdzEbR3HJIrFUZOPMthHuOseINM8PW/n6lf21jF0DXEgXJ9BnqfYVxevfEG6u4Ik094tAs538tdX1pDHu94YGwznnq21e/Ncpo+p6H/wki3MDaXpKP9mW2e9hNxqV2LmIFHSV2LDDsVxhh8jZ9sC68P8AiHUPCl/c+Nbiw0WaC/muBqV5eSR289sxMbwSKGVwNqK4CnacL71vSoKTtJ/569kI6jwf4m8Ox+IvEHguRNQsPEVy8lvJqt03mS3x2nD+av3GwSVjO3gZUYryoazD+zX4fT4ReCvFF34o8bajNNdPqeuTGddJjkzteUgfeOAscZ5ZvasW++PV1rWky6R8Lrr7Lp39oQaTq3jfU4XeQyeUEMsER4GAFHmSkL6BjXjOh/D/AFbxv8TZ/Cvgays9b1JtPXT/ABRql9C01hHMGST7ZPMCDPPuU4ibJViRnAr63B5Vyc7xT5ILVp911fbfb7yebtubN94Vm+JHiaf4S+EriHW7+aeT+25tU08yy6E+5TcXxuifmklZRsVcAkjgAEV9/fDf4e6P8LvBOkeF9Bt/s2mabAsMS9WYj7zse7McsT3JNcz8A/gH4c+APgtNF0RHubyYiXUdWuTuuL+fHMkjfoF6AcCvTR/WvDzXMvrklRot+zjtfq+7X5eQRVhADz600j86f600/erwChTjFJtNLjinEUANVaCKUGmls0AFApAcml7U0AUtIKWmAueKFprZFAqRj6bk0gooAdnIphFLijpSAOhpcmkzQtA2O29aO49KXHWmrndTJHUUUUAFHrRR60ARzdOOtMWnP3pAeaBirS44pVo9KBiY25pdu45zQe9KM0AxQMClo96KCQ9KPWj0o9aAEPeomXNTUx+KBkKrg8VKq96Fxn1qQYoG2FFFFBInSkzyc0HtSdzQPoHelXoaQ/eopgApaQU5aQMNvFG2j1p1AhhFG3pQT7UelABTvWm+lO9aACkxS0UANIpu0LUm0UygaE2g5o2CjHWl/CgYBfSnCk5+lOWgkTb0pG7070prd6APMvjZ+z/4U+O+hpZa7by297bsJLPVbFhHdWrgggqxBBGQPlYEH0r5W8V/B/4k/CmSJPFlvf8AxS8IpNNd3+saYzS6heKExFBcWjkqyrhSCCwyv3eTn71A+ak27uo5r2sHmmIwaUPih2fT0e6CyPy/8E/EjxLpM9jP4I8QXGj3Edq+oatpNu6lEkeVkjtVtZMRq4CrllAUZYnoAfe9L+PPxVn8aXHg3xD4M8M+KZtPtLO+mmhneM/vpNiEAqwyCGJbCgBSQMYr6F+IX7P/AMP/AIoK3/CR+FrC+mIx9pWPypx9JEw3614nq/8AwTz8KjUZ9R8N+NPF/hm9ndJHePUPtKsyZ8vPmgk7cnAJ4r6iWb5Vjv49Pkdt+W+t/wCaLT79CIpx6mn4k+OVx4qsYNM174V6nexzYaOG21CFhKJI1TKcrkYnAJ7Z9q8a8Qftm+CvCP23w5Z/DLUIpNHu5rQrJqqwpHIBskTfGSSpCgEdDxXp0f7Gfjm3tlhg+Nmo4VTGJJNIi8xYz5QKhg4I+WFBx6H1Nc/on/BNHQ2mvLjxL411HXbu7u3u55I7VIA7O+9uMnGWzn610ZbLhunJvHzbitlHn3/rzIk6ltEeG+KP+ChPjvVLQPpfhnw34TS3X7Pb3UcLXk8CY4CswVV4x/DivKfsvxT/AGgtWS5u9Q1nxXc+Z8rXikJFyB+7jC4GSf4R9fWv0r0X9j74b6RGYn0g30DMHME7DyyR0OABnp3r1rQ/C+j+GrX7PpWm2thFnO23iC8nvxXs/wCt2S5Wn/Y+CSn/ADS/psw9nVn8bsfCfwK/YF8W+bfzeNvEMmhaFqVusN5o+kuPPvUJyUkcg+WOx2/MeeRX294F+Hvh74Z+HLbQvDOkW2jaXbjCW9qgUE92Y9WY9yck10G09qaWO4DtX5xmudYzOKzq4mW/RKy/r1OqEFBWRKFwKdSDpS14ZYUd6KKAA0tNbpQtABik25pc8UbhQAm3FABpfrSZ+WmAnenCmhqDxzStcBxWhVoB4pRQAm2looJ4oAKQjIp1JQAzFKtLtGaO1AxfWij1ooEFFFFABR60UHoaAGt96k296Tcd1LQAKtKF4FApfSmAnrQRkCnY60UgEGe9LRQKAD0o9aPSj1oAO9Ndd1O701vWgCP+Ling4XmjjNKKoADUUUVICgCkA60o60i96ABuD0pKRu1LQMBT+lNXtTqAYUbqQ9aG+8KBCHqaXHSkPU070oGHaj1pO1L60CCiiigAbpTPSnt0pnpQNCdqdTWp7dBQDE/WnU1adQIQ9uKRqG7U0d6AHUi/eo7GlXtTAXFLjpRTaQxdvFG2hfu0vegRGw7gc0i+tOamLQMf2zTM5PFO7H6VF6/WgROrBl4p1Rw/cqSgA9aaOWpfWkX71AA3vSZokpaBoSkoWhqBC/UUdqbS0DEH3qVvvUnej+IVQMX60q0xupoXt9KkB+T2pNx705e1IaYh60UUUgDvTd3alao6AJfWikH3TS0AFFFFABSN900tI3Q0ANpRjv60UlUA4Cl9KBR6VIB60UetFABRRRQA3nindjTT2p3agAB5prYp3emt1pgNzjr1pR0pklPX7oqgHKKKaO9FQB//2Q==',
      }
    ],
    // pageBreakBefore: function (currentNode) {
    //   // we add a page break before TABLE with the classname "pdf-pagebreak-before"
    //   return currentNode.table && currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1
    // },
    defaultStyle: {
      font: 'TimesNewRoman'
    }
    // pageOrientation: 'landscape',
  }

  if (action === 'open') {
    pdfMake.createPdf(docDefinition).open()
  } else if (action === 'blob') {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
    // const getBase64 = (data) => ({ data });
    return new Promise((resolve, reject) => {
      pdfDocGenerator.getBase64(data => {
        resolve(data)
      })
    })
  } else {
    pdfMake.createPdf(docDefinition).open()
  }
}
