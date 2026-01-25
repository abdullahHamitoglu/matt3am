import { Button, Form, Input } from '@heroui/react'
import { Icon } from '@iconify/react'
import React from 'react'

type Props = {}

const NewsLater = (props: Props) => {
    return (
        <div className="flex md:flex-row flex-col justify-between items-center self-stretch gap-2.5 bg-secondary-500 my-7 md:my-14 p-4 md:px-9 md:py-7 rounded-2xl">
            <div className="inline-flex flex-col justify-center items-start self-stretch gap-1">
                <h5 className="justify-start font-semibold text-white text-lg capitalize">النشرة الإخبارية</h5>
                <span className="justify-start font-normal text-white/80 text-base">كن أول من يعرف عن الخصومات والعروض والأحداث.</span>
            </div>
            <Form onSubmit={(data) => console.log(data)}>
                <Input
                    isRequired
                    errorMessage='البريد الإلكتروني مطلوب'
                    classNames={{ inputWrapper: "!bg-primary-500 pe-2 rounded-full md:w-96 w-full hover:bg-primary-500 h-12", input: "!placeholder-white text-sm font-normal text-white" }}
                    startContent={<Icon icon="iconoir:mail" className="w-4 h-4 text-white" />}
                    endContent={<Button type='submit' className="block bg-white py-1 rounded-full h-9 font-semibold text-secondary-500 text-sm">ارسال</Button>}
                    name="email"
                    placeholder="اضف بريدك الإلكتروني"
                    type="email"
                />
            </Form>
        </div>
    )
}

export default NewsLater