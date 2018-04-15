/**
 * Created by ChienHo on 2018/2/23.
 */
import detect from './pages/Detect.vue'
import track from './pages/Track.vue'
import about from './pages/About.vue'

export default [
    {'path': '/', component: detect},
    {'path': '/track', component: track},
    {'path': '/about', component: about},
]
