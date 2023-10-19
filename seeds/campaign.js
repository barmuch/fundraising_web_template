/* eslint-disable no-console */
import mongoose from 'mongoose'

import Campaign from '../models/campaign.js'

mongoose
    .connect('mongodb://127.0.0.1/fundraising_example')
    .then((result) => {
        console.log('connected to mongodb')
    })
    .catch((err) => {
        console.log(err)
    })

async function seedCampaigns() {
    const campaigns = [
        {
            title: 'Campaign 1',
            description:
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas aliquam magnam vero explicabo eius molestias repellat eos quis, exercitationem perspiciatis quibusdam iusto sit excepturi ut dolore unde quia accusantium voluptatem labore quasi delectus ab, pariatur quidem assumenda. Consectetur repellendus illum excepturi, harum sunt ab nesciunt obcaecati consequuntur iure officiis distinctio accusantium nobis ea. Laudantium ad inventore, maxime rem repellendus debitis minima reiciendis aut, iusto dicta facere minus eius quod voluptatibus numquam maiores ipsum. Odit id doloremque quaerat aspernatur cumque commodi suscipit, necessitatibus tenetur? Sit id omnis excepturi esse, aspernatur non, eos exercitationem pariatur est tempora dolor neque incidunt maiores vel?',
            target: 5000000,
            image: 'https://source.unsplash.com/collection/2349781/1280x720',
        },
        {
            title: 'Campaign 2',
            description:
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas aliquam magnam vero explicabo eius molestias repellat eos quis, exercitationem perspiciatis quibusdam iusto sit excepturi ut dolore unde quia accusantium voluptatem labore quasi delectus ab, pariatur quidem assumenda. Consectetur repellendus illum excepturi, harum sunt ab nesciunt obcaecati consequuntur iure officiis distinctio accusantium nobis ea. Laudantium ad inventore, maxime rem repellendus debitis minima reiciendis aut, iusto dicta facere minus eius quod voluptatibus numquam maiores ipsum. Odit id doloremque quaerat aspernatur cumque commodi suscipit, necessitatibus tenetur? Sit id omnis excepturi esse, aspernatur non, eos exercitationem pariatur est tempora dolor neque incidunt maiores vel?',
            target: 5000000,
            image: 'https://source.unsplash.com/collection/2349781/1280x720',
        },
        {
            title: 'Campaign 3',
            description:
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas aliquam magnam vero explicabo eius molestias repellat eos quis, exercitationem perspiciatis quibusdam iusto sit excepturi ut dolore unde quia accusantium voluptatem labore quasi delectus ab, pariatur quidem assumenda. Consectetur repellendus illum excepturi, harum sunt ab nesciunt obcaecati consequuntur iure officiis distinctio accusantium nobis ea. Laudantium ad inventore, maxime rem repellendus debitis minima reiciendis aut, iusto dicta facere minus eius quod voluptatibus numquam maiores ipsum. Odit id doloremque quaerat aspernatur cumque commodi suscipit, necessitatibus tenetur? Sit id omnis excepturi esse, aspernatur non, eos exercitationem pariatur est tempora dolor neque incidunt maiores vel?',
            target: 5000000,
            image: 'https://source.unsplash.com/collection/2349781/1280x720',
        },
        {
            title: 'Campaign 4',
            description:
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas aliquam magnam vero explicabo eius molestias repellat eos quis, exercitationem perspiciatis quibusdam iusto sit excepturi ut dolore unde quia accusantium voluptatem labore quasi delectus ab, pariatur quidem assumenda. Consectetur repellendus illum excepturi, harum sunt ab nesciunt obcaecati consequuntur iure officiis distinctio accusantium nobis ea. Laudantium ad inventore, maxime rem repellendus debitis minima reiciendis aut, iusto dicta facere minus eius quod voluptatibus numquam maiores ipsum. Odit id doloremque quaerat aspernatur cumque commodi suscipit, necessitatibus tenetur? Sit id omnis excepturi esse, aspernatur non, eos exercitationem pariatur est tempora dolor neque incidunt maiores vel?',
            target: 5000000,
            image: 'https://source.unsplash.com/collection/2349781/1280x720',
        },
        {
            title: 'Campaign 5',
            description:
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas aliquam magnam vero explicabo eius molestias repellat eos quis, exercitationem perspiciatis quibusdam iusto sit excepturi ut dolore unde quia accusantium voluptatem labore quasi delectus ab, pariatur quidem assumenda. Consectetur repellendus illum excepturi, harum sunt ab nesciunt obcaecati consequuntur iure officiis distinctio accusantium nobis ea. Laudantium ad inventore, maxime rem repellendus debitis minima reiciendis aut, iusto dicta facere minus eius quod voluptatibus numquam maiores ipsum. Odit id doloremque quaerat aspernatur cumque commodi suscipit, necessitatibus tenetur? Sit id omnis excepturi esse, aspernatur non, eos exercitationem pariatur est tempora dolor neque incidunt maiores vel?',
            target: 5000000,
            image: 'https://source.unsplash.com/collection/2349781/1280x720',
        },
    ]

    // const newCampaign = await Promise.all(campaigns.map(async (campaign) => {

    //     return {
    //         ...campaign,
    //         author: '643d36579773b789e91ef660',
    //         images: {
    //             url: 'public\\images\\image-1681876521153-260851838.jpg',
    //             filename: 'image-1681876521153-260851838.jpg'
    //         }

    //     }
    //}))

    try {
        await Campaign.deleteMany({})
        await Campaign.insertMany(campaigns)
        console.log('Data berhasil disimpan')
    } catch (err) {
        console.log('Terjadi kesalahan saat menyimpan data:', err)
    } finally {
        mongoose.disconnect()
    }
}

seedCampaigns()
