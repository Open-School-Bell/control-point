import {useState} from 'react'
import type {Route} from './+types/app'
import {useLoaderData, Form, useActionData} from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [{title: 'OSB Control Point'}]
}

export const loader = async ({}: Route.LoaderArgs) => {
  const response = await fetch(`${process.env.CONTROLLER_URL}/config`, {
    headers: {Auth: process.env.CONTROLLER_KEY!}
  })

  const config = (await response.json()) as {
    zones: Array<{id: string; name: string}>
  }

  return {config}
}

export const action = async ({request}: Route.ActionArgs) => {
  const formData = await request.formData()

  const zone = formData.get('zone')
  const pin = formData.get('pin')

  if (!zone || !pin) {
    return
  }

  const response = await fetch(`${process.env.CONTROLLER_URL}/trigger`, {
    headers: {
      Auth: process.env.CONTROLLER_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({pin, zone}),
    method: 'post'
  })

  const data = (await response.json()) as
    | {result: 'error'; error: string}
    | {result: 'succcess'; message: string}

  return data
}

export default function App() {
  const [pin, setPin] = useState('')
  const {config} = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()

  return (
    <Form
      className="grid grid-cols-5 gap-8 mt-8"
      method="post"
      onSubmit={() => {
        setPin('')
      }}
    >
      {data ? (
        <div
          className={`rounded-xl col-start-2 col-span-3 p-2 text-center ${data.result === 'error' ? 'bg-red/75' : 'bg-green-600/75'}`}
        >
          {data.result === 'error' ? data.error : data.message}
        </div>
      ) : (
        ''
      )}
      <input type="hidden" value={pin} name="pin" />
      <div className="col-start-2 col-span-3 text-center text-3xl border border-white rounded-xl p-4">
        &nbsp;{pin.replaceAll(/[0-9]/g, '•')}
      </div>
      <div
        className="col-start-2 text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}1`)
        }}
      >
        1
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}2`)
        }}
      >
        2
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}3`)
        }}
      >
        3
      </div>
      <div
        className="col-start-2 text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}4`)
        }}
      >
        4
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}5`)
        }}
      >
        5
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}6`)
        }}
      >
        6
      </div>
      <div
        className="col-start-2 text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}7`)
        }}
      >
        7
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}8`)
        }}
      >
        8
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}9`)
        }}
      >
        9
      </div>
      <div
        className="col-start-2 text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(pin.slice(0, -1))
        }}
      >
        ⬅️
      </div>
      <div
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all"
        onClick={() => {
          setPin(`${pin}0`)
        }}
      >
        0
      </div>
      <button
        className="text-center border border-white rounded-xl p-4 hover:bg-white/50 transition-all disabled:bg-red-100/50"
        disabled={pin.length === 0}
      >
        ✅
      </button>
      <select
        className="col-start-2 col-span-3 bg-white/75 text-black p-4 rounded-xl"
        name="zone"
      >
        {config.zones.map(({id, name}) => {
          return (
            <option key={id} value={id}>
              {name}
            </option>
          )
        })}
      </select>
    </Form>
  )
}
